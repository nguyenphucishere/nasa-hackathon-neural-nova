"""
Earth Engine data collection and preprocessing
"""
import ee
import time
import pandas as pd
import numpy as np
from typing import Optional, Tuple, Dict, Any, List
from datetime import datetime, timedelta

try:
    from .spectral_indices import SpectralIndices
    from ..utils.ee_utils import robust_getinfo
except ImportError:
    # Fallback for when running as script
    import sys
    from pathlib import Path
    src_path = Path(__file__).parent.parent
    sys.path.insert(0, str(src_path))
    from data.spectral_indices import SpectralIndices
    from utils.ee_utils import robust_getinfo


class EarthEngineDataCollector:
    """Collect and preprocess satellite data from Earth Engine"""
    
    def __init__(
        self,
        cloud_threshold: int = 40,
        scale: int = 20,
        use_topo_correction: bool = False  # Disabled temporarily due to EE type issues
    ):
        """
        Initialize data collector
        
        Args:
            cloud_threshold: Cloud probability threshold (%)
            scale: Spatial resolution in meters
            use_topo_correction: Apply topographic illumination correction
        """
        self.cloud_threshold = cloud_threshold
        self.scale = scale
        self.use_topo_correction = use_topo_correction
        self.spectral_calc = SpectralIndices()
    
    def get_sentinel2_collection(
        self,
        geometry: ee.Geometry,
        start_date: str,
        end_date: str
    ) -> ee.ImageCollection:
        """
        Get Sentinel-2 Surface Reflectance collection with cloud masking
        
        Args:
            geometry: Area of interest
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            
        Returns:
            Processed image collection
        """
        # Sentinel-2 Surface Reflectance
        s2 = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
              .filterBounds(geometry)
              .filterDate(start_date, end_date)
              .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 80)))
        
        # Cloud probability
        s2_cloud = (ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')
                    .filterBounds(geometry)
                    .filterDate(start_date, end_date))
        
        # Join collections by system:index
        join_filter = ee.Filter.equals(leftField='system:index', rightField='system:index')
        joined = ee.Join.saveFirst('cloud_mask').apply(s2, s2_cloud, join_filter)
        
        def add_cloud_band(img):
            img = ee.Image(img)
            cloud_prob = ee.Image(img.get('cloud_mask')).select('probability')
            return img.addBands(cloud_prob.rename('cloud_probability'))
        
        collection = ee.ImageCollection(joined).map(add_cloud_band)
        
        # Apply cloud masking
        def mask_clouds(img):
            img = self._cloud_mask(img)
            if self.use_topo_correction:
                img = self._topographic_correction(img, geometry)
            return img
        
        collection = collection.map(mask_clouds)
        
        # Add spectral indices
        collection = collection.map(self.spectral_calc.add_all_indices)
        
        return collection.sort('system:time_start')
    
    def _cloud_mask(self, image: ee.Image) -> ee.Image:
        """
        Mask clouds using SCL band and cloud probability
        
        Args:
            image: Sentinel-2 image
            
        Returns:
            Masked image
        """
        scl = image.select('SCL')
        
        # Mask: 0=NO_DATA, 1=SATURATED, 3=CLOUD_SHADOW, 8=CLOUD_MEDIUM_PROB,
        #       9=CLOUD_HIGH_PROB, 10=THIN_CIRRUS, 11=SNOW
        good_pixels = scl.remap(
            [0, 1, 3, 8, 9, 10, 11],
            [0, 0, 0, 0, 0, 0, 0],
            defaultValue=1
        )
        
        # Cloud probability mask
        cloud_prob = image.select('cloud_probability')
        cloud_mask = cloud_prob.lt(self.cloud_threshold)
        
        # Combine masks
        final_mask = good_pixels.And(cloud_mask)
        
        return image.updateMask(final_mask)
    
    def _topographic_correction(
        self,
        image: ee.Image,
        region: ee.Geometry,
        bands: Tuple[str, ...] = ('B2', 'B3', 'B4', 'B5', 'B8')
    ) -> ee.Image:
        """
        Apply C-correction for topographic illumination
        
        Args:
            image: Input image
            region: Area of interest
            bands: Bands to correct
            
        Returns:
            Corrected image
        """
        # Get DEM and terrain products
        dem = ee.Image('USGS/SRTMGL1_003').clip(region)
        terrain = ee.Terrain.products(dem)
        
        # Convert to radians
        slope = terrain.select('slope').multiply(np.pi / 180)
        aspect = terrain.select('aspect').multiply(np.pi / 180)
        
        # Solar geometry
        solar_azimuth = ee.Number(image.get('MEAN_SOLAR_AZIMUTH_ANGLE')).multiply(np.pi / 180)
        solar_zenith = ee.Number(image.get('MEAN_SOLAR_ZENITH_ANGLE')).multiply(np.pi / 180)
        
        # Calculate illumination (cosine of incidence angle)
        cos_z = solar_zenith.cos()
        sin_z = solar_zenith.sin()
        
        cos_i = (cos_z.multiply(slope.cos())
                .add(sin_z.multiply(slope.sin())
                .multiply((solar_azimuth.subtract(aspect)).cos())))
        
        # Ensure cos_i is an image
        cos_i = ee.Image(cos_i)
        
        # Cosine of terrain slope (for horizontal surface)
        cos_t = ee.Image.constant(cos_z)
        
        # Apply correction to each band
        corrected = image
        for band in bands:
            L = image.select(band).multiply(1 / 10000)
            
            # Linear regression to find c parameter
            regression = L.addBands(cos_i).reduceRegion(
                reducer=ee.Reducer.linearFit(),
                geometry=region,
                scale=self.scale,
                maxPixels=1e13,
                bestEffort=True
            )
            
            a = ee.Number(regression.get('scale'))
            b = ee.Number(regression.get('offset'))
            
            # C parameter (avoid division by zero)
            c = ee.Number(ee.Algorithms.If(
                a.neq(0),
                b.divide(a),
                0
            ))
            
            # Convert c to constant image
            c_img = ee.Image.constant(c)
            
            # Apply C-correction: L_corrected = L * (cos_t + c) / (cos_i + c)
            L_corrected = L.multiply(cos_t.add(c_img)).divide(cos_i.add(c_img))
            
            corrected = corrected.addBands(
                L_corrected.multiply(10000).rename(band + '_tc'),
                overwrite=False
            )
        
        return corrected
    
    def create_composite(
        self,
        collection: ee.ImageCollection,
        method: str = 'median'
    ) -> ee.Image:
        """
        Create temporal composite
        
        Args:
            collection: Image collection
            method: Compositing method ('median', 'mean', 'geomedian')
            
        Returns:
            Composite image
        """
        if method == 'median':
            return collection.median()
        elif method == 'mean':
            return collection.mean()
        elif method == 'geomedian':
            # Approximate geomedian with median for now
            # True geomedian requires more complex implementation
            return collection.median()
        else:
            raise ValueError(f"Unknown compositing method: {method}")
    
    def extract_time_series(
        self,
        collection: ee.ImageCollection,
        geometry: ee.Geometry,
        bands: Optional[List[str]] = None,
        reducer: ee.Reducer = None
    ) -> pd.DataFrame:
        """
        Extract time series statistics for a region
        
        Args:
            collection: Image collection
            geometry: Region to extract
            bands: Bands to extract (default: bloom-sensitive indices)
            reducer: Reduction method (default: mean)
            
        Returns:
            DataFrame with time series
        """
        if bands is None:
            bands = SpectralIndices.get_bloom_sensitive_bands()
        
        if reducer is None:
            reducer = ee.Reducer.mean()
        
        def extract_stats(img):
            img = ee.Image(img)
            
            # Reduce region
            stats = img.select(bands).reduceRegion(
                reducer=reducer,
                geometry=geometry,
                scale=self.scale,
                maxPixels=1e13,
                bestEffort=True
            )
            
            # Get date
            date_str = img.date().format('YYYY-MM-dd')
            
            return ee.Feature(None, stats).set('date', date_str)
        
        # Map extraction
        fc = collection.map(extract_stats)
        
        # Filter out null values
        fc = fc.filter(ee.Filter.notNull(bands[:1]))  # At least first band must be present
        
        # Convert to pandas with robust getInfo
        data = self._fc_to_dataframe(fc, properties=['date'] + bands)
        
        if len(data) > 0:
            data['date'] = pd.to_datetime(data['date'])
            data = data.sort_values('date').reset_index(drop=True)
        
        return data
    
    def _fc_to_dataframe(
        self,
        fc: ee.FeatureCollection,
        properties: List[str]
    ) -> pd.DataFrame:
        """
        Convert FeatureCollection to DataFrame with rate limiting
        
        Args:
            fc: Feature collection
            properties: Properties to extract
            
        Returns:
            DataFrame
        """
        size = int(robust_getinfo(fc.size()))
        
        if size == 0:
            return pd.DataFrame(columns=properties)
        
        # Get features in batches to avoid timeout
        batch_size = 500
        all_rows = []
        
        for start in range(0, size, batch_size):
            end = min(start + batch_size, size)
            batch = fc.toList(end - start, start)
            
            for i in range(end - start):
                try:
                    feat = ee.Feature(batch.get(i))
                    props = robust_getinfo(feat.toDictionary())
                    row = {k: props.get(k) for k in properties}
                    all_rows.append(row)
                except Exception as e:
                    print(f"Warning: Failed to extract feature {start + i}: {e}")
                    continue
            
            # Rate limiting
            if end < size:
                time.sleep(0.5)
        
        return pd.DataFrame(all_rows)
    
    def export_raster(
        self,
        image: ee.Image,
        description: str,
        folder: str,
        geometry: ee.Geometry,
        bands: Optional[List[str]] = None
    ) -> ee.batch.Task:
        """
        Export raster to Google Drive
        
        Args:
            image: Image to export
            description: Export description
            folder: Drive folder name
            geometry: Export region
            bands: Bands to export (optional)
            
        Returns:
            Export task
        """
        if bands is not None:
            image = image.select(bands)
        
        task = ee.batch.Export.image.toDrive(
            image=image.clip(geometry),
            description=description,
            folder=folder,
            region=geometry,
            scale=self.scale,
            maxPixels=1e13,
            fileFormat='GeoTIFF',
            formatOptions={'cloudOptimized': True}
        )
        
        task.start()
        print(f"🚀 Started export: {description}")
        
        return task

"""
Simple Earth Engine data collector - matches notebook logic exactly
No complex topographic correction - just cloud masking and indices
"""
import ee
import pandas as pd
import numpy as np
from typing import Optional, List
from datetime import datetime

try:
    from .spectral_indices import SpectralIndices
    from ..utils.ee_utils import robust_getinfo
except ImportError:
    import sys
    from pathlib import Path
    src_path = Path(__file__).parent.parent
    sys.path.insert(0, str(src_path))
    from data.spectral_indices import SpectralIndices
    from utils.ee_utils import robust_getinfo


class EarthEngineDataCollector:
    """Simple data collector matching notebook approach"""
    
    def __init__(self, scale: int = 20):
        """
        Initialize collector
        
        Args:
            scale: Resolution in meters (default: 20m for S2)
        """
        self.scale = scale
        self.spectral_calc = SpectralIndices()
    
    def _cloud_mask(self, image: ee.Image) -> ee.Image:
        """
        Simple cloud masking using SCL band
        Matches notebook s2_cloudmask() function
        
        Args:
            image: Sentinel-2 image
            
        Returns:
            Masked image
        """
        scl = image.select('SCL')
        
        # Mask: 3=shadow, 8=cloud, 9=thin cirrus, 10=cloud high prob, 11=snow/ice
        # Keep all other classes (good pixels = 1)
        good_pixels = scl.remap(
            [3, 8, 9, 10, 11],
            [0, 0, 0, 0, 0],
            1  # default value for non-masked classes
        )
        
        return image.updateMask(good_pixels)
    
    def get_sentinel2_collection(
        self,
        geometry: ee.Geometry,
        start_date: str,
        end_date: str
    ) -> ee.ImageCollection:
        """
        Get Sentinel-2 collection - matches notebook s2_collection() function
        
        Args:
            geometry: Area of interest
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            
        Returns:
            Processed image collection with indices
        """
        collection = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                     .filterBounds(geometry)
                     .filterDate(start_date, end_date)
                     .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 60))
                     .map(self._cloud_mask)
                     .map(self.spectral_calc.add_all_indices))
        
        return collection.sort('system:time_start')
    
    def extract_time_series(
        self,
        collection: ee.ImageCollection,
        geometry: ee.Geometry,
        bands: Optional[List[str]] = None,
        reducer: ee.Reducer = None
    ) -> pd.DataFrame:
        """
        Extract time series - matches notebook ts_reduce_to_df() function
        
        Args:
            collection: Image collection
            geometry: Region to extract
            bands: Bands to extract (default: bloom indices)
            reducer: Reduction method (default: mean)
            
        Returns:
            DataFrame with time series
        """
        if bands is None:
            bands = SpectralIndices.get_bloom_sensitive_bands()
        
        if reducer is None:
            reducer = ee.Reducer.mean()
        
        # Select bands
        collection = collection.select(bands)
        
        def extract_stats(img):
            """Reduce image to AOI mean and attach date"""
            img = ee.Image(img)
            stats = img.reduceRegion(
                reducer=reducer,
                geometry=geometry,
                scale=self.scale,
                maxPixels=1e13,
                bestEffort=True
            )
            date_str = img.date().format('YYYY-MM-dd')
            return ee.Feature(None, stats).set('date', date_str)
        
        # Map extraction over collection
        fc = collection.map(extract_stats)
        
        # Filter out nulls (images with all masked pixels)
        fc = fc.filter(ee.Filter.notNull(bands[:1]))  # At least first band must exist
        
        # Convert to DataFrame - matches notebook fc_to_df() function
        df = self._fc_to_dataframe(fc, properties=['date'] + bands)
        
        if len(df) > 0:
            df['date'] = pd.to_datetime(df['date'])
            df = df.sort_values('date').reset_index(drop=True)
        
        return df
    
    def _fc_to_dataframe(
        self,
        fc: ee.FeatureCollection,
        properties: List[str]
    ) -> pd.DataFrame:
        """
        Robust FC to DataFrame conversion - matches notebook fc_to_df()
        No geemap dependency, handles moderate-sized collections
        
        Args:
            fc: Feature collection
            properties: Properties to extract
            
        Returns:
            Pandas DataFrame
        """
        # Get size
        try:
            size = int(robust_getinfo(fc.size()))
        except Exception as e:
            print(f"Warning: Could not get collection size: {e}")
            return pd.DataFrame(columns=properties)
        
        if size == 0:
            return pd.DataFrame(columns=properties)
        
        # Convert to list
        lst = fc.toList(size)
        
        # Extract features in batches to avoid timeout
        batch_size = 50
        all_rows = []
        
        for start in range(0, size, batch_size):
            end = min(start + batch_size, size)
            batch = lst.slice(start, end)
            
            try:
                # Get batch info
                batch_info = robust_getinfo(batch)
                
                for feat_dict in batch_info:
                    props = feat_dict.get('properties', {})
                    row = {k: props.get(k) for k in properties}
                    all_rows.append(row)
            except Exception as e:
                print(f"Warning: Failed to extract batch {start}-{end}: {e}")
                continue
        
        return pd.DataFrame(all_rows)
    
    def create_composite(
        self,
        collection: ee.ImageCollection,
        method: str = 'median'
    ) -> ee.Image:
        """
        Create composite image
        
        Args:
            collection: Image collection
            method: Compositing method ('median', 'mean', 'max')
            
        Returns:
            Composite image
        """
        if method == 'median':
            return collection.median()
        elif method == 'mean':
            return collection.mean()
        elif method == 'max':
            return collection.max()
        else:
            raise ValueError(f"Unknown method: {method}")

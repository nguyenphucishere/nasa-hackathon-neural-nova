"""
Spectral indices calculation for bloom detection
"""
import ee
from typing import List, Dict, Any
import numpy as np


class SpectralIndices:
    """Calculate vegetation and pigment indices for bloom detection"""
    
    def __init__(self, epsilon: float = 1e-3):
        """
        Initialize spectral indices calculator
        
        Args:
            epsilon: Small value to prevent division by zero
        """
        self.eps = epsilon
    
    def add_all_indices(self, image: ee.Image) -> ee.Image:
        """
        Add all spectral indices to image
        
        Args:
            image: Sentinel-2 Surface Reflectance image
            
        Returns:
            Image with added index bands
        """
        image = self.add_ari(image)
        image = self.add_nyi(image)
        image = self.add_cri(image)
        image = self.add_ndvi(image)
        image = self.add_evi(image)
        image = self.add_savi(image)
        image = self.add_red_edge_indices(image)
        return image
    
    def add_ari(self, image: ee.Image) -> ee.Image:
        """
        Anthocyanin Reflectance Index (ARI1)
        Sensitive to red/purple pigments
        
        Formula: (1/B03) - (1/B05)
        """
        b3 = image.select('B3').add(self.eps)
        b5 = image.select('B5').add(self.eps)
        
        ari = b3.pow(-1).subtract(b5.pow(-1)).rename('ARI')
        return image.addBands(ari)
    
    def add_nyi(self, image: ee.Image) -> ee.Image:
        """
        Normalized Yellowing Index
        Optimal for yellow flower detection (e.g., rape/canola)
        
        Formula: (NIR - Green) / (NIR + Green)
        """
        nir = image.select('B8').multiply(1/10000)
        green = image.select('B3').multiply(1/10000)
        
        nyi = nir.subtract(green).divide(
            nir.add(green).add(self.eps)
        ).rename('NYI')
        
        return image.addBands(nyi)
    
    def add_cri(self, image: ee.Image) -> ee.Image:
        """
        Carotenoid Reflectance Index
        Sensitive to carotenoid pigments
        
        Formula: (1/B02) - (1/B05)
        """
        b2 = image.select('B2').add(self.eps)
        b5 = image.select('B5').add(self.eps)
        
        cri = b2.pow(-1).subtract(b5.pow(-1)).rename('CRI')
        return image.addBands(cri)
    
    def add_ndvi(self, image: ee.Image) -> ee.Image:
        """
        Normalized Difference Vegetation Index
        Standard vegetation health index
        
        Formula: (NIR - Red) / (NIR + Red)
        """
        ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
        return image.addBands(ndvi)
    
    def add_evi(self, image: ee.Image) -> ee.Image:
        """
        Enhanced Vegetation Index
        Improved sensitivity in high biomass regions
        
        Formula: 2.5 * ((NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1))
        """
        nir = image.select('B8').multiply(1/10000)
        red = image.select('B4').multiply(1/10000)
        blue = image.select('B2').multiply(1/10000)
        
        evi = nir.subtract(red).divide(
            nir.add(red.multiply(6)).subtract(blue.multiply(7.5)).add(1)
        ).multiply(2.5).rename('EVI')
        
        return image.addBands(evi)
    
    def add_savi(self, image: ee.Image, L: float = 0.5) -> ee.Image:
        """
        Soil Adjusted Vegetation Index
        Minimizes soil brightness influences
        
        Formula: ((NIR - Red) / (NIR + Red + L)) * (1 + L)
        """
        nir = image.select('B8').multiply(1/10000)
        red = image.select('B4').multiply(1/10000)
        
        savi = nir.subtract(red).divide(
            nir.add(red).add(L)
        ).multiply(1 + L).rename('SAVI')
        
        return image.addBands(savi)
    
    def add_red_edge_indices(self, image: ee.Image) -> ee.Image:
        """
        Red Edge indices using Sentinel-2's unique bands
        B5, B6, B7 are red edge bands
        """
        # NDRE - Normalized Difference Red Edge
        ndre = image.normalizedDifference(['B8', 'B5']).rename('NDRE')
        
        # Red Edge Position (simplified)
        b5 = image.select('B5').multiply(1/10000)
        b6 = image.select('B6').multiply(1/10000)
        b7 = image.select('B7').multiply(1/10000)
        
        # IRECI - Inverted Red-Edge Chlorophyll Index
        ireci = b7.subtract(b4 := image.select('B4').multiply(1/10000)).divide(
            b5.divide(b6).add(self.eps)
        ).rename('IRECI')
        
        return image.addBands([ndre, ireci])
    
    def calculate_temporal_derivatives(
        self, 
        collection: ee.ImageCollection,
        index_name: str
    ) -> ee.ImageCollection:
        """
        Calculate temporal derivatives (rate of change) for an index
        
        Args:
            collection: Time series image collection
            index_name: Name of the index band
            
        Returns:
            Collection with derivative band added
        """
        def add_derivative(img):
            # Get next image in sequence
            img = ee.Image(img)
            img_date = ee.Date(img.get('system:time_start'))
            
            # Find next image within 30 days
            next_img = collection.filterDate(
                img_date.advance(1, 'day'),
                img_date.advance(30, 'day')
            ).first()
            
            # Calculate derivative
            current_val = img.select(index_name)
            next_val = ee.Image(next_img).select(index_name)
            
            # Time difference in days
            time_diff = ee.Number(next_img.get('system:time_start')).subtract(
                img.get('system:time_start')
            ).divide(1000 * 60 * 60 * 24)  # Convert ms to days
            
            derivative = next_val.subtract(current_val).divide(
                time_diff
            ).rename(f'{index_name}_derivative')
            
            return img.addBands(derivative)
        
        return collection.map(add_derivative)
    
    @staticmethod
    def get_bloom_sensitive_bands() -> List[str]:
        """
        Get list of bands most sensitive to bloom events
        
        Returns:
            List of band names
        """
        return [
            'ARI',           # Anthocyanin (red/purple flowers)
            'NYI',           # Yellow flowers
            'CRI',           # Carotenoids
            'NDVI',          # General vegetation (decreases during bloom)
            'EVI',           # Enhanced vegetation
            'NDRE',          # Red edge sensitivity
            'ARI_derivative',  # Rate of change
            'NYI_derivative'
        ]
    
    @staticmethod
    def get_expected_bloom_signature(flower_color: str) -> Dict[str, str]:
        """
        Get expected spectral signature during bloom
        
        Args:
            flower_color: 'yellow', 'red', 'purple', 'white', 'pink'
            
        Returns:
            Dictionary of expected index behaviors
        """
        signatures = {
            'yellow': {
                'NYI': 'decrease',
                'CRI': 'increase',
                'NDVI': 'decrease',
                'ARI': 'slight_increase'
            },
            'red': {
                'ARI': 'strong_increase',
                'NDVI': 'decrease',
                'NYI': 'slight_decrease'
            },
            'purple': {
                'ARI': 'strong_increase',
                'NDVI': 'decrease',
                'NDRE': 'increase'
            },
            'white': {
                'NDVI': 'decrease',
                'EVI': 'decrease',
                'SAVI': 'decrease'
            },
            'pink': {
                'ARI': 'moderate_increase',
                'NDVI': 'decrease',
                'NDRE': 'slight_increase'
            }
        }
        
        return signatures.get(flower_color.lower(), {})

"""
Spatial analysis for bloom hotspot detection
"""
import numpy as np
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
from typing import Tuple, Optional, List, Dict, Any
from sklearn.cluster import DBSCAN
from esda.getisord import G_Local
from libpysal.weights import DistanceBand
import warnings
warnings.filterwarnings('ignore')


class HotspotAnalyzer:
    """Analyze bloom hotspots using spatial statistics"""
    
    def __init__(
        self,
        probability_threshold: float = 0.70,
        distance_band: float = 1000,
        dbscan_eps: float = 500,
        dbscan_min_samples: int = 10
    ):
        """
        Initialize hotspot analyzer
        
        Args:
            probability_threshold: Minimum bloom probability to consider
            distance_band: Distance band for Gi* analysis (meters)
            dbscan_eps: DBSCAN epsilon parameter (meters)
            dbscan_min_samples: DBSCAN minimum samples
        """
        self.probability_threshold = probability_threshold
        self.distance_band = distance_band
        self.dbscan_eps = dbscan_eps
        self.dbscan_min_samples = dbscan_min_samples
    
    def identify_hotspots(
        self,
        predictions: pd.DataFrame,
        lon_col: str = 'lon',
        lat_col: str = 'lat',
        prob_col: str = 'bloom_probability',
        date_col: str = 'date'
    ) -> gpd.GeoDataFrame:
        """
        Identify bloom hotspots from prediction data
        
        Args:
            predictions: DataFrame with predictions
            lon_col: Longitude column name
            lat_col: Latitude column name
            prob_col: Bloom probability column name
            date_col: Date column name
            
        Returns:
            GeoDataFrame with hotspot analysis results
        """
        print(f"\n🔍 Identifying bloom hotspots...")
        print(f"   Probability threshold: {self.probability_threshold}")
        print(f"   Total predictions: {len(predictions)}")
        
        # Filter by probability threshold
        hotspots = predictions[predictions[prob_col] >= self.probability_threshold].copy()
        print(f"   High-probability locations: {len(hotspots)}")
        
        if len(hotspots) == 0:
            print("   ⚠️  No hotspots found above threshold")
            return gpd.GeoDataFrame()
        
        # Create GeoDataFrame
        geometry = [Point(xy) for xy in zip(hotspots[lon_col], hotspots[lat_col])]
        gdf = gpd.GeoDataFrame(
            hotspots,
            geometry=geometry,
            crs='EPSG:4326'
        )
        
        # Project to UTM for metric calculations (approximate for Southeast Asia)
        gdf_utm = gdf.to_crs('EPSG:32648')  # UTM Zone 48N
        
        # Perform Getis-Ord Gi* analysis
        print(f"   Running Getis-Ord Gi* analysis...")
        gdf_utm = self._getis_ord_gi_star(gdf_utm, prob_col)
        
        # Perform DBSCAN clustering
        print(f"   Running DBSCAN clustering...")
        gdf_utm = self._dbscan_clustering(gdf_utm)
        
        # Convert back to WGS84
        gdf = gdf_utm.to_crs('EPSG:4326')
        
        # Summary statistics
        n_hotspots = len(gdf[gdf['gi_star_significant'] == True])
        n_clusters = gdf['cluster_id'].nunique() - (1 if -1 in gdf['cluster_id'].values else 0)
        
        print(f"   ✅ Statistically significant hotspots: {n_hotspots}")
        print(f"   ✅ DBSCAN clusters found: {n_clusters}")
        
        return gdf
    
    def _getis_ord_gi_star(
        self,
        gdf: gpd.GeoDataFrame,
        value_col: str
    ) -> gpd.GeoDataFrame:
        """
        Calculate Getis-Ord Gi* statistic
        
        Args:
            gdf: GeoDataFrame (must be in projected CRS)
            value_col: Column with values to analyze
            
        Returns:
            GeoDataFrame with Gi* results
        """
        try:
            # Create spatial weights matrix (distance band)
            w = DistanceBand.from_dataframe(
                gdf,
                threshold=self.distance_band,
                binary=False,
                alpha=-1.0  # Inverse distance weighting
            )
            
            # Calculate Gi*
            values = gdf[value_col].values
            gi_star = G_Local(values, w, star=True)
            
            # Add results to GeoDataFrame
            gdf['gi_star_z'] = gi_star.Zs
            gdf['gi_star_p'] = gi_star.p_sim
            
            # Classify significance (p < 0.05)
            gdf['gi_star_significant'] = gdf['gi_star_p'] < 0.05
            
            # Classify hotspot types
            gdf['hotspot_type'] = 'Not Significant'
            gdf.loc[(gdf['gi_star_z'] > 1.96) & (gdf['gi_star_p'] < 0.05), 'hotspot_type'] = 'Hot Spot'
            gdf.loc[(gdf['gi_star_z'] < -1.96) & (gdf['gi_star_p'] < 0.05), 'hotspot_type'] = 'Cold Spot'
            
        except Exception as e:
            print(f"   ⚠️  Gi* calculation failed: {e}")
            gdf['gi_star_z'] = np.nan
            gdf['gi_star_p'] = np.nan
            gdf['gi_star_significant'] = False
            gdf['hotspot_type'] = 'Error'
        
        return gdf
    
    def _dbscan_clustering(self, gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
        """
        Perform DBSCAN clustering
        
        Args:
            gdf: GeoDataFrame (must be in projected CRS)
            
        Returns:
            GeoDataFrame with cluster IDs
        """
        # Extract coordinates
        coords = np.array([[geom.x, geom.y] for geom in gdf.geometry])
        
        # DBSCAN clustering
        dbscan = DBSCAN(
            eps=self.dbscan_eps,
            min_samples=self.dbscan_min_samples,
            metric='euclidean'
        )
        
        clusters = dbscan.fit_predict(coords)
        gdf['cluster_id'] = clusters
        
        # Mark noise points
        gdf['is_noise'] = gdf['cluster_id'] == -1
        
        # Calculate cluster statistics
        cluster_stats = []
        for cluster_id in gdf['cluster_id'].unique():
            if cluster_id == -1:  # Skip noise
                continue
            
            cluster_points = gdf[gdf['cluster_id'] == cluster_id]
            
            stats = {
                'cluster_id': cluster_id,
                'n_points': len(cluster_points),
                'mean_probability': cluster_points['bloom_probability'].mean(),
                'max_probability': cluster_points['bloom_probability'].max(),
                'centroid_lon': cluster_points.geometry.centroid.x.mean(),
                'centroid_lat': cluster_points.geometry.centroid.y.mean()
            }
            cluster_stats.append(stats)
        
        gdf.cluster_stats = pd.DataFrame(cluster_stats)
        
        return gdf
    
    def rank_hotspots(
        self,
        gdf: gpd.GeoDataFrame,
        method: str = 'combined'
    ) -> gpd.GeoDataFrame:
        """
        Rank hotspots by importance
        
        Args:
            gdf: GeoDataFrame with hotspot analysis results
            method: Ranking method ('probability', 'gi_star', 'combined')
            
        Returns:
            GeoDataFrame with hotspot rankings
        """
        if len(gdf) == 0:
            return gdf
        
        if method == 'probability':
            gdf['hotspot_rank'] = gdf['bloom_probability'].rank(ascending=False)
        
        elif method == 'gi_star':
            # Only rank significant hotspots
            gdf['hotspot_rank'] = np.nan
            significant = gdf[gdf['gi_star_significant'] == True]
            if len(significant) > 0:
                ranks = significant['gi_star_z'].rank(ascending=False)
                gdf.loc[significant.index, 'hotspot_rank'] = ranks
        
        elif method == 'combined':
            # Normalize probability and gi_star_z
            if 'gi_star_z' in gdf.columns:
                prob_norm = (gdf['bloom_probability'] - gdf['bloom_probability'].min()) / \
                           (gdf['bloom_probability'].max() - gdf['bloom_probability'].min() + 1e-9)
                
                gi_norm = (gdf['gi_star_z'] - gdf['gi_star_z'].min()) / \
                         (gdf['gi_star_z'].max() - gdf['gi_star_z'].min() + 1e-9)
                
                # Combined score (weighted average)
                gdf['combined_score'] = 0.6 * prob_norm + 0.4 * gi_norm
                gdf['hotspot_rank'] = gdf['combined_score'].rank(ascending=False)
            else:
                gdf['hotspot_rank'] = gdf['bloom_probability'].rank(ascending=False)
        
        return gdf.sort_values('hotspot_rank')
    
    def get_top_hotspots(
        self,
        gdf: gpd.GeoDataFrame,
        n: int = 150,
        method: str = 'combined'
    ) -> gpd.GeoDataFrame:
        """
        Get top N hotspots
        
        Args:
            gdf: GeoDataFrame with hotspot analysis
            n: Number of top hotspots to return
            method: Ranking method
            
        Returns:
            Top N hotspots
        """
        if len(gdf) == 0:
            return gdf
        
        gdf = self.rank_hotspots(gdf, method)
        return gdf.head(n)
    
    def create_hotspot_summary(
        self,
        gdf: gpd.GeoDataFrame
    ) -> Dict[str, Any]:
        """
        Create summary statistics for hotspots
        
        Args:
            gdf: GeoDataFrame with hotspot analysis
            
        Returns:
            Dictionary with summary statistics
        """
        if len(gdf) == 0:
            return {}
        
        summary = {
            'total_locations': len(gdf),
            'significant_hotspots': len(gdf[gdf.get('gi_star_significant', False) == True]),
            'n_clusters': gdf['cluster_id'].nunique() - (1 if -1 in gdf['cluster_id'].values else 0),
            'noise_points': len(gdf[gdf.get('is_noise', False) == True]),
            'mean_probability': gdf['bloom_probability'].mean(),
            'max_probability': gdf['bloom_probability'].max(),
            'mean_gi_star_z': gdf.get('gi_star_z', pd.Series([np.nan])).mean()
        }
        
        # Cluster statistics
        if hasattr(gdf, 'cluster_stats'):
            summary['cluster_stats'] = gdf.cluster_stats.to_dict('records')
        
        return summary
    
    def export_hotspots(
        self,
        gdf: gpd.GeoDataFrame,
        output_path: str,
        format: str = 'geojson'
    ) -> None:
        """
        Export hotspots to file
        
        Args:
            gdf: GeoDataFrame with hotspots
            output_path: Output file path
            format: Output format ('geojson', 'shapefile', 'csv')
        """
        if len(gdf) == 0:
            print("   ⚠️  No hotspots to export")
            return
        
        if format == 'geojson':
            gdf.to_file(output_path, driver='GeoJSON')
        elif format == 'shapefile':
            gdf.to_file(output_path, driver='ESRI Shapefile')
        elif format == 'csv':
            # Extract lon/lat from geometry
            df = gdf.copy()
            df['lon'] = df.geometry.x
            df['lat'] = df.geometry.y
            df = df.drop(columns=['geometry'])
            df.to_csv(output_path, index=False)
        else:
            raise ValueError(f"Unknown format: {format}")
        
        print(f"✅ Hotspots exported to {output_path}")

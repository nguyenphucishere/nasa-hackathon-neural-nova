"""
Visualization utilities for bloom forecasting results
"""
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
import folium
from folium import plugins
import numpy as np
import pandas as pd
import geopandas as gpd
from pathlib import Path
from typing import Optional, Dict, Any, List
import ee


class BloomVisualizer:
    """Visualize bloom forecasting results"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize visualizer
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
        self.color_palettes = config.get('visualization', {}).get('color_palettes', {})
        
        # Set matplotlib style
        sns.set_style('whitegrid')
        plt.rcParams['figure.dpi'] = 150
    
    def plot_time_series(
        self,
        df: pd.DataFrame,
        date_col: str = 'date',
        value_cols: List[str] = None,
        title: str = 'Time Series',
        save_path: Optional[Path] = None
    ) -> plt.Figure:
        """
        Plot time series data
        
        Args:
            df: DataFrame with time series
            date_col: Date column name
            value_cols: Columns to plot
            title: Plot title
            save_path: Path to save figure
            
        Returns:
            Matplotlib figure
        """
        if value_cols is None:
            value_cols = [col for col in df.columns if col != date_col]
        
        fig, ax = plt.subplots(figsize=(12, 4))
        
        for col in value_cols:
            ax.plot(df[date_col], df[col], label=col, marker='o', markersize=3, alpha=0.7)
        
        ax.set_xlabel('Date')
        ax.set_ylabel('Index Value')
        ax.set_title(title)
        ax.legend()
        ax.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=160, bbox_inches='tight')
            print(f"✅ Saved plot: {save_path}")
        
        return fig
    
    def plot_predictions(
        self,
        y_true: np.ndarray,
        y_pred: np.ndarray,
        dates: Optional[pd.Series] = None,
        title: str = 'Bloom Predictions',
        save_path: Optional[Path] = None
    ) -> plt.Figure:
        """
        Plot predictions vs actual values
        
        Args:
            y_true: True values
            y_pred: Predicted values
            dates: Date indices (optional)
            title: Plot title
            save_path: Path to save
            
        Returns:
            Matplotlib figure
        """
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
        
        # Time series comparison
        x = dates if dates is not None else np.arange(len(y_true))
        ax1.plot(x, y_true, label='Actual', marker='o', alpha=0.7)
        ax1.plot(x, y_pred, label='Predicted', marker='s', alpha=0.7)
        ax1.set_xlabel('Date' if dates is not None else 'Sample')
        ax1.set_ylabel('Bloom Probability')
        ax1.set_title(f'{title} - Time Series')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Scatter plot
        ax2.scatter(y_true, y_pred, alpha=0.5)
        ax2.plot([0, 1], [0, 1], 'r--', label='Perfect Prediction')
        ax2.set_xlabel('Actual')
        ax2.set_ylabel('Predicted')
        ax2.set_title(f'{title} - Scatter')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=160, bbox_inches='tight')
            print(f"✅ Saved plot: {save_path}")
        
        return fig
    
    def plot_feature_importance(
        self,
        importance_dict: Dict[str, float],
        top_n: int = 20,
        title: str = 'Feature Importance',
        save_path: Optional[Path] = None
    ) -> plt.Figure:
        """
        Plot feature importance
        
        Args:
            importance_dict: Dictionary of feature importances
            top_n: Number of top features to show
            title: Plot title
            save_path: Path to save
            
        Returns:
            Matplotlib figure
        """
        # Sort and get top N
        items = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)[:top_n]
        features, importances = zip(*items)
        
        fig, ax = plt.subplots(figsize=(10, max(6, top_n * 0.3)))
        
        y_pos = np.arange(len(features))
        ax.barh(y_pos, importances)
        ax.set_yticks(y_pos)
        ax.set_yticklabels(features)
        ax.invert_yaxis()
        ax.set_xlabel('Importance')
        ax.set_title(title)
        ax.grid(True, alpha=0.3, axis='x')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=160, bbox_inches='tight')
            print(f"✅ Saved plot: {save_path}")
        
        return fig
    
    def create_interactive_map(
        self,
        hotspots_gdf: gpd.GeoDataFrame,
        aoi_geometry: Optional[Any] = None,
        aoi_name: str = 'AOI',
        center: Optional[List[float]] = None,
        zoom: int = 10
    ) -> folium.Map:
        """
        Create interactive Folium map with hotspots
        
        Args:
            hotspots_gdf: GeoDataFrame with hotspots
            aoi_geometry: AOI geometry (ee.Geometry or shapely)
            aoi_name: Name of AOI
            center: Map center [lat, lon]
            zoom: Initial zoom level
            
        Returns:
            Folium map
        """
        # Determine center
        if center is None:
            if len(hotspots_gdf) > 0:
                center = [hotspots_gdf.geometry.y.mean(), hotspots_gdf.geometry.x.mean()]
            else:
                center = self.config.get('visualization', {}).get('map_center', [21.5, 104.8])
        
        # Create base map
        m = folium.Map(location=center, zoom_start=zoom, tiles='OpenStreetMap')
        
        # Add satellite basemap option
        folium.TileLayer(
            tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attr='Esri',
            name='Esri Satellite',
            overlay=False,
            control=True
        ).add_to(m)
        
        # Add AOI boundary if provided
        if aoi_geometry is not None:
            if isinstance(aoi_geometry, ee.Geometry):
                # Convert EE geometry to GeoJSON
                aoi_geojson = aoi_geometry.getInfo()
                folium.GeoJson(
                    aoi_geojson,
                    name=f'{aoi_name} Boundary',
                    style_function=lambda x: {
                        'fillColor': 'transparent',
                        'color': 'yellow',
                        'weight': 3
                    }
                ).add_to(m)
        
        # Add hotspots
        if len(hotspots_gdf) > 0:
            # Color by probability or gi_star_z
            if 'gi_star_z' in hotspots_gdf.columns:
                color_column = 'gi_star_z'
                colormap = plt.cm.RdYlBu_r
            else:
                color_column = 'bloom_probability'
                colormap = plt.cm.YlOrRd
            
            # Normalize colors
            vmin = hotspots_gdf[color_column].min()
            vmax = hotspots_gdf[color_column].max()
            
            for idx, row in hotspots_gdf.iterrows():
                # Color mapping
                value = row[color_column]
                norm_value = (value - vmin) / (vmax - vmin + 1e-9)
                # Fix: use matplotlib.colors, not plt.colors
                from matplotlib import colors as mcolors
                color = mcolors.rgb2hex(colormap(norm_value))
                
                # Popup content
                popup_html = f"""
                <div style="font-family: Arial; font-size: 12px;">
                    <b>Bloom Probability:</b> {row.get('bloom_probability', 0):.3f}<br>
                    <b>Gi* Z-score:</b> {row.get('gi_star_z', 0):.3f}<br>
                    <b>Hotspot Type:</b> {row.get('hotspot_type', 'N/A')}<br>
                    <b>Cluster ID:</b> {row.get('cluster_id', -1)}<br>
                    <b>Lat, Lon:</b> {row.geometry.y:.5f}, {row.geometry.x:.5f}
                </div>
                """
                
                # Add marker
                folium.CircleMarker(
                    location=[row.geometry.y, row.geometry.x],
                    radius=5 if row.get('gi_star_significant', False) else 3,
                    popup=folium.Popup(popup_html, max_width=300),
                    color=color,
                    fill=True,
                    fillColor=color,
                    fillOpacity=0.7,
                    weight=2 if row.get('gi_star_significant', False) else 1
                ).add_to(m)
            
            # Add heatmap layer
            heat_data = [[row.geometry.y, row.geometry.x, row['bloom_probability']] 
                         for idx, row in hotspots_gdf.iterrows()]
            
            plugins.HeatMap(
                heat_data,
                name='Bloom Probability Heatmap',
                min_opacity=0.3,
                radius=15,
                blur=20,
                show=False
            ).add_to(m)
        
        # Add layer control
        folium.LayerControl().add_to(m)
        
        return m
    
    def create_plotly_dashboard(
        self,
        time_series_df: pd.DataFrame,
        hotspots_gdf: gpd.GeoDataFrame,
        predictions: np.ndarray,
        save_path: Optional[Path] = None
    ) -> go.Figure:
        """
        Create interactive Plotly dashboard
        
        Args:
            time_series_df: Time series data
            hotspots_gdf: Hotspots GeoDataFrame
            predictions: Model predictions
            save_path: Path to save HTML
            
        Returns:
            Plotly figure
        """
        from plotly.subplots import make_subplots
        
        # Create subplots
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=(
                'Time Series - Spectral Indices',
                'Bloom Probability Distribution',
                'Hotspot Locations',
                'Gi* Z-scores Distribution'
            ),
            specs=[
                [{'type': 'scatter'}, {'type': 'histogram'}],
                [{'type': 'scattergeo'}, {'type': 'histogram'}]
            ]
        )
        
        # Time series
        if 'date' in time_series_df.columns:
            for col in ['ARI', 'NYI', 'NDVI']:
                if col in time_series_df.columns:
                    fig.add_trace(
                        go.Scatter(
                            x=time_series_df['date'],
                            y=time_series_df[col],
                            name=col,
                            mode='lines+markers'
                        ),
                        row=1, col=1
                    )
        
        # Probability distribution
        if len(predictions) > 0:
            fig.add_trace(
                go.Histogram(
                    x=predictions.flatten(),
                    name='Bloom Probability',
                    nbinsx=30
                ),
                row=1, col=2
            )
        
        # Hotspot map
        if len(hotspots_gdf) > 0:
            fig.add_trace(
                go.Scattergeo(
                    lon=hotspots_gdf.geometry.x,
                    lat=hotspots_gdf.geometry.y,
                    mode='markers',
                    marker=dict(
                        size=8,
                        color=hotspots_gdf.get('bloom_probability', 0),
                        colorscale='YlOrRd',
                        showscale=True,
                        colorbar=dict(title='Probability')
                    ),
                    text=hotspots_gdf.get('hotspot_type', 'N/A'),
                    name='Hotspots'
                ),
                row=2, col=1
            )
        
        # Gi* distribution
        if len(hotspots_gdf) > 0 and 'gi_star_z' in hotspots_gdf.columns:
            fig.add_trace(
                go.Histogram(
                    x=hotspots_gdf['gi_star_z'],
                    name='Gi* Z-score',
                    nbinsx=30
                ),
                row=2, col=2
            )
        
        # Update layout
        fig.update_layout(
            height=800,
            title_text="Bloom Forecasting Dashboard",
            showlegend=True
        )
        
        fig.update_geos(
            projection_type="natural earth",
            showcountries=True,
            row=2, col=1
        )
        
        if save_path:
            fig.write_html(save_path)
            print(f"✅ Saved interactive dashboard: {save_path}")
        
        return fig
    
    def save_map(self, folium_map: folium.Map, save_path: Path) -> None:
        """Save Folium map to HTML"""
        folium_map.save(str(save_path))
        print(f"✅ Saved interactive map: {save_path}")

"""
Configuration management utilities
"""
import os
import yaml
from pathlib import Path
from typing import Dict, Any, Optional
from dotenv import load_dotenv


class Config:
    """Configuration manager for the bloom forecasting system"""
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize configuration
        
        Args:
            config_path: Path to config.yaml (defaults to project root)
        """
        # Load environment variables
        load_dotenv()
        
        # Find config file
        if config_path is None:
            project_root = Path(__file__).parent.parent.parent
            config_path = project_root / "config.yaml"
        
        # Load YAML config
        with open(config_path, 'r', encoding='utf-8') as f:
            self._config = yaml.safe_load(f)
        
        # Project root directory
        self.project_root = Path(__file__).parent.parent.parent
        
        # Setup output directories
        self._setup_output_dirs()
    
    def _setup_output_dirs(self):
        """Create output directory structure"""
        base_dir = self.project_root / self.get('output.base_dir', 'outputs')
        
        dirs = [
            'timeseries_dir',
            'models_dir',
            'predictions_dir',
            'hotspots_dir',
            'visualizations_dir'
        ]
        
        for dir_key in dirs:
            dir_path = base_dir / self.get(f'output.{dir_key}', dir_key.replace('_dir', ''))
            dir_path.mkdir(parents=True, exist_ok=True)
            setattr(self, dir_key, dir_path)
    
    def get(self, key: str, default: Any = None) -> Any:
        """
        Get configuration value using dot notation
        
        Args:
            key: Configuration key (e.g., 'models.lstm.hidden_size')
            default: Default value if key not found
            
        Returns:
            Configuration value
        """
        keys = key.split('.')
        value = self._config
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    def get_aoi(self, name: str) -> Optional[Dict[str, Any]]:
        """
        Get AOI configuration by name
        
        Args:
            name: AOI name
            
        Returns:
            AOI configuration dictionary
        """
        aois = self.get('aois', [])
        for aoi in aois:
            if aoi.get('name') == name:
                return aoi
        return None
    
    def get_all_aois(self) -> list:
        """Get all AOI configurations"""
        return self.get('aois', [])
    
    def get_spectral_index(self, name: str) -> Optional[Dict[str, Any]]:
        """
        Get spectral index configuration
        
        Args:
            name: Index name (e.g., 'ARI', 'NDVI')
            
        Returns:
            Index configuration
        """
        indices = self.get('spectral_indices', {})
        return indices.get(name)
    
    def get_model_config(self, model_name: str) -> Dict[str, Any]:
        """
        Get model hyperparameters
        
        Args:
            model_name: Model name (e.g., 'lstm', 'random_forest')
            
        Returns:
            Model configuration dictionary
        """
        return self.get(f'models.{model_name}', {})
    
    @property
    def ee_project_id(self) -> str:
        """Get Earth Engine project ID from environment"""
        return os.getenv('EE_PROJECT_ID', 'genial-upgrade-467713-n9')
    
    @property
    def use_gpu(self) -> bool:
        """Check if GPU should be used"""
        cuda_devices = os.getenv('CUDA_VISIBLE_DEVICES', '')
        return bool(cuda_devices and cuda_devices != '-1')
    
    def __repr__(self) -> str:
        return f"Config(project='{self.get('project_name')}', version='{self.get('version')}')"


# Global config instance
_config = None


def get_config(config_path: Optional[str] = None) -> Config:
    """
    Get global configuration instance
    
    Args:
        config_path: Path to config.yaml (optional)
        
    Returns:
        Config instance
    """
    global _config
    if _config is None:
        _config = Config(config_path)
    return _config

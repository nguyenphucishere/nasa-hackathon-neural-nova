"""
Base model interface and common utilities
"""
from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any, Optional
import numpy as np
import pandas as pd
from pathlib import Path
import joblib
import json


class BaseBloomModel(ABC):
    """Abstract base class for bloom forecasting models"""
    
    def __init__(self, model_name: str, config: Dict[str, Any]):
        """
        Initialize model
        
        Args:
            model_name: Name of the model
            config: Model configuration dictionary
        """
        self.model_name = model_name
        self.config = config
        self.model = None
        self.is_trained = False
        self.feature_names = None
        self.scaler = None
    
    @abstractmethod
    def build_model(self) -> None:
        """Build/initialize the model architecture"""
        pass
    
    @abstractmethod
    def train(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: Optional[np.ndarray] = None,
        y_val: Optional[np.ndarray] = None
    ) -> Dict[str, Any]:
        """
        Train the model
        
        Args:
            X_train: Training features
            y_train: Training labels
            X_val: Validation features (optional)
            y_val: Validation labels (optional)
            
        Returns:
            Training history/metrics
        """
        pass
    
    @abstractmethod
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make predictions
        
        Args:
            X: Input features
            
        Returns:
            Predictions
        """
        pass
    
    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """
        Predict probabilities (for classification models)
        
        Args:
            X: Input features
            
        Returns:
            Probability predictions
        """
        if hasattr(self.model, 'predict_proba'):
            return self.model.predict_proba(X)
        else:
            # For regression models, clip to [0, 1]
            preds = self.predict(X)
            return np.clip(preds, 0, 1)
    
    def save(self, save_dir: Path) -> None:
        """
        Save model to disk
        
        Args:
            save_dir: Directory to save model
        """
        save_dir = Path(save_dir)
        save_dir.mkdir(parents=True, exist_ok=True)
        
        # Save model
        model_path = save_dir / f"{self.model_name}_model.pkl"
        joblib.dump(self.model, model_path)
        
        # Save metadata
        metadata = {
            'model_name': self.model_name,
            'config': self.config,
            'is_trained': self.is_trained,
            'feature_names': self.feature_names
        }
        
        metadata_path = save_dir / f"{self.model_name}_metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        # Save scaler if exists
        if self.scaler is not None:
            scaler_path = save_dir / f"{self.model_name}_scaler.pkl"
            joblib.dump(self.scaler, scaler_path)
        
        print(f"✅ Model saved to {save_dir}")
    
    def load(self, load_dir: Path) -> None:
        """
        Load model from disk
        
        Args:
            load_dir: Directory containing saved model
        """
        load_dir = Path(load_dir)
        
        # Load model
        model_path = load_dir / f"{self.model_name}_model.pkl"
        self.model = joblib.load(model_path)
        
        # Load metadata
        metadata_path = load_dir / f"{self.model_name}_metadata.json"
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        self.is_trained = metadata['is_trained']
        self.feature_names = metadata['feature_names']
        
        # Load scaler if exists
        scaler_path = load_dir / f"{self.model_name}_scaler.pkl"
        if scaler_path.exists():
            self.scaler = joblib.load(scaler_path)
        
        print(f"✅ Model loaded from {load_dir}")
    
    def get_feature_importance(self) -> Optional[pd.DataFrame]:
        """
        Get feature importance (if supported by model)
        
        Returns:
            DataFrame with feature importances
        """
        if not hasattr(self.model, 'feature_importances_'):
            return None
        
        importances = self.model.feature_importances_
        
        df = pd.DataFrame({
            'feature': self.feature_names,
            'importance': importances
        })
        
        return df.sort_values('importance', ascending=False)
    
    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(name='{self.model_name}', trained={self.is_trained})"


class TimeSeriesDataPreprocessor:
    """Preprocess time series data for model training"""
    
    @staticmethod
    def create_sequences(
        data: np.ndarray,
        sequence_length: int,
        forecast_horizon: int = 1,
        stride: int = 1
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Create sequences for time series forecasting
        
        Args:
            data: Time series data (n_samples, n_features)
            sequence_length: Length of input sequences
            forecast_horizon: Number of steps to forecast
            stride: Step size between sequences
            
        Returns:
            X: Input sequences (n_sequences, sequence_length, n_features)
            y: Target values (n_sequences, forecast_horizon)
        """
        X, y = [], []
        
        for i in range(0, len(data) - sequence_length - forecast_horizon + 1, stride):
            # Input sequence
            X.append(data[i:i + sequence_length])
            
            # Target (forecast horizon steps ahead)
            y.append(data[i + sequence_length:i + sequence_length + forecast_horizon, 0])
        
        return np.array(X), np.array(y)
    
    @staticmethod
    def normalize_sequences(
        X_train: np.ndarray,
        X_val: Optional[np.ndarray] = None,
        X_test: Optional[np.ndarray] = None,
        method: str = 'standard'
    ) -> Tuple:
        """
        Normalize sequences
        
        Args:
            X_train: Training sequences
            X_val: Validation sequences (optional)
            X_test: Test sequences (optional)
            method: Normalization method ('standard' or 'minmax')
            
        Returns:
            Normalized sequences and scaler
        """
        from sklearn.preprocessing import StandardScaler, MinMaxScaler
        
        # Reshape to 2D for scaling
        original_shape = X_train.shape
        X_train_2d = X_train.reshape(-1, X_train.shape[-1])
        
        # Fit scaler
        if method == 'standard':
            scaler = StandardScaler()
        else:
            scaler = MinMaxScaler()
        
        X_train_scaled = scaler.fit_transform(X_train_2d)
        X_train_scaled = X_train_scaled.reshape(original_shape)
        
        results = [X_train_scaled, scaler]
        
        # Transform validation and test sets
        if X_val is not None:
            val_shape = X_val.shape
            X_val_2d = X_val.reshape(-1, X_val.shape[-1])
            X_val_scaled = scaler.transform(X_val_2d).reshape(val_shape)
            results.append(X_val_scaled)
        
        if X_test is not None:
            test_shape = X_test.shape
            X_test_2d = X_test.reshape(-1, X_test.shape[-1])
            X_test_scaled = scaler.transform(X_test_2d).reshape(test_shape)
            results.append(X_test_scaled)
        
        return tuple(results)
    
    @staticmethod
    def add_temporal_features(df: pd.DataFrame, date_col: str = 'date') -> pd.DataFrame:
        """
        Add temporal features from date column
        
        Args:
            df: DataFrame with date column
            date_col: Name of date column
            
        Returns:
            DataFrame with added temporal features
        """
        df = df.copy()
        df[date_col] = pd.to_datetime(df[date_col])
        
        # Extract temporal components
        df['day_of_year'] = df[date_col].dt.dayofyear
        df['month'] = df[date_col].dt.month
        df['week'] = df[date_col].dt.isocalendar().week
        
        # Cyclical encoding
        df['day_sin'] = np.sin(2 * np.pi * df['day_of_year'] / 365.25)
        df['day_cos'] = np.cos(2 * np.pi * df['day_of_year'] / 365.25)
        df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
        df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
        
        return df
    
    @staticmethod
    def calculate_z_scores(df: pd.DataFrame, columns: list) -> pd.DataFrame:
        """
        Calculate z-scores for specified columns
        
        Args:
            df: Input DataFrame
            columns: Columns to calculate z-scores for
            
        Returns:
            DataFrame with added z-score columns
        """
        df = df.copy()
        
        for col in columns:
            if col in df.columns:
                mean = df[col].mean()
                std = df[col].std()
                df[f'{col}_z'] = (df[col] - mean) / (std + 1e-9)
        
        return df

"""
Random Forest model for bloom forecasting
"""
import numpy as np
from typing import Dict, Any, Optional
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler

from .base_model import BaseBloomModel


class RandomForestBloomModel(BaseBloomModel):
    """Random Forest model for bloom probability forecasting"""
    
    def __init__(self, config: Dict[str, Any], task: str = 'classification'):
        """
        Initialize Random Forest model
        
        Args:
            config: Model configuration
            task: 'classification' or 'regression'
        """
        super().__init__('random_forest', config)
        self.task = task
        self.scaler = StandardScaler()
    
    def build_model(self) -> None:
        """Build Random Forest model"""
        if self.task == 'classification':
            self.model = RandomForestClassifier(
                n_estimators=self.config.get('n_estimators', 200),
                max_depth=self.config.get('max_depth', 20),
                min_samples_split=self.config.get('min_samples_split', 5),
                min_samples_leaf=self.config.get('min_samples_leaf', 2),
                max_features=self.config.get('max_features', 'sqrt'),
                n_jobs=self.config.get('n_jobs', -1),
                random_state=42,
                verbose=1
            )
        else:
            self.model = RandomForestRegressor(
                n_estimators=self.config.get('n_estimators', 200),
                max_depth=self.config.get('max_depth', 20),
                min_samples_split=self.config.get('min_samples_split', 5),
                min_samples_leaf=self.config.get('min_samples_leaf', 2),
                max_features=self.config.get('max_features', 'sqrt'),
                n_jobs=self.config.get('n_jobs', -1),
                random_state=42,
                verbose=1
            )
        
        print(f"✅ Built {self.task} Random Forest model")
        print(f"   Estimators: {self.config.get('n_estimators', 200)}")
        print(f"   Max depth: {self.config.get('max_depth', 20)}")
    
    def train(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: Optional[np.ndarray] = None,
        y_val: Optional[np.ndarray] = None
    ) -> Dict[str, Any]:
        """
        Train Random Forest model
        
        Args:
            X_train: Training features (can be 3D for sequences)
            y_train: Training labels
            X_val: Validation features (not used for RF)
            y_val: Validation labels (not used for RF)
            
        Returns:
            Training metrics
        """
        print(f"\n🌲 Training Random Forest ({self.task})...")
        print(f"   Training samples: {len(X_train)}")
        
        # Flatten 3D sequences to 2D for Random Forest
        # Shape: (n_samples, seq_len, n_features) -> (n_samples, seq_len * n_features)
        if X_train.ndim == 3:
            n_samples, seq_len, n_features = X_train.shape
            X_train = X_train.reshape(n_samples, seq_len * n_features)
            print(f"   Reshaped from (samples, seq_len, features) to (samples, {seq_len * n_features} features)")
        
        print(f"   Features: {X_train.shape[1]}")
        
        # Normalize features
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        self.is_trained = True
        
        # Calculate training metrics
        train_score = self.model.score(X_train_scaled, y_train)
        
        metrics = {
            'train_score': train_score,
            'n_estimators': self.model.n_estimators,
            'n_features': X_train.shape[1]
        }
        
        # Validation metrics if provided
        if X_val is not None and y_val is not None:
            # Flatten validation data too
            if X_val.ndim == 3:
                n_val, seq_len, n_features = X_val.shape
                X_val = X_val.reshape(n_val, seq_len * n_features)
            
            X_val_scaled = self.scaler.transform(X_val)
            val_score = self.model.score(X_val_scaled, y_val)
            metrics['val_score'] = val_score
            print(f"   Validation score: {val_score:.4f}")
        
        print(f"   Training score: {train_score:.4f}")
        print(f"✅ Training completed!")
        
        return metrics
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make predictions
        
        Args:
            X: Input features (can be 3D for sequences)
            
        Returns:
            Predictions
        """
        if not self.is_trained:
            raise RuntimeError("Model must be trained before prediction")
        
        # Flatten 3D sequences to 2D
        if X.ndim == 3:
            n_samples, seq_len, n_features = X.shape
            X = X.reshape(n_samples, seq_len * n_features)
        
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)
    
    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """
        Predict probabilities
        
        Args:
            X: Input features (can be 3D for sequences)
            
        Returns:
            Probability predictions
        """
        if not self.is_trained:
            raise RuntimeError("Model must be trained before prediction")
        
        # Flatten 3D sequences to 2D
        if X.ndim == 3:
            n_samples, seq_len, n_features = X.shape
            X = X.reshape(n_samples, seq_len * n_features)
        
        X_scaled = self.scaler.transform(X)
        
        if self.task == 'classification':
            return self.model.predict_proba(X_scaled)
        else:
            # For regression, clip predictions to [0, 1]
            preds = self.model.predict(X_scaled)
            return np.clip(preds, 0, 1)
    
    def get_feature_importance(self, feature_names: list = None) -> dict:
        """
        Get feature importance scores
        
        Args:
            feature_names: List of feature names
            
        Returns:
            Dictionary of feature importances
        """
        if not self.is_trained:
            raise RuntimeError("Model must be trained first")
        
        importances = self.model.feature_importances_
        
        if feature_names is None:
            feature_names = [f'feature_{i}' for i in range(len(importances))]
        
        # Sort by importance
        indices = np.argsort(importances)[::-1]
        
        importance_dict = {
            feature_names[i]: importances[i]
            for i in indices
        }
        
        return importance_dict

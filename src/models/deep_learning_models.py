"""
LSTM/GRU models for time series bloom forecasting
"""
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from typing import Dict, Any, Optional, Tuple
from pathlib import Path
import json

from .base_model import BaseBloomModel


class TimeSeriesDataset(Dataset):
    """PyTorch Dataset for time series data"""
    
    def __init__(self, X: np.ndarray, y: np.ndarray):
        """
        Initialize dataset
        
        Args:
            X: Input sequences (n_samples, seq_len, n_features)
            y: Target values (n_samples, forecast_horizon)
        """
        self.X = torch.FloatTensor(X)
        self.y = torch.FloatTensor(y)
    
    def __len__(self) -> int:
        return len(self.X)
    
    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, torch.Tensor]:
        return self.X[idx], self.y[idx]


class LSTMModel(nn.Module):
    """LSTM model for sequence forecasting"""
    
    def __init__(
        self,
        input_size: int,
        hidden_size: int,
        num_layers: int,
        output_size: int,
        dropout: float = 0.2,
        bidirectional: bool = False
    ):
        """
        Initialize LSTM model
        
        Args:
            input_size: Number of input features
            hidden_size: LSTM hidden size
            num_layers: Number of LSTM layers
            output_size: Output dimension
            dropout: Dropout rate
            bidirectional: Use bidirectional LSTM
        """
        super(LSTMModel, self).__init__()
        
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.bidirectional = bidirectional
        
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            dropout=dropout if num_layers > 1 else 0,
            bidirectional=bidirectional,
            batch_first=True
        )
        
        # Fully connected layer
        fc_input_size = hidden_size * 2 if bidirectional else hidden_size
        self.fc = nn.Sequential(
            nn.Linear(fc_input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_size, output_size),
            nn.Sigmoid()  # Output probability [0, 1]
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass
        
        Args:
            x: Input tensor (batch, seq_len, features)
            
        Returns:
            Output tensor (batch, output_size)
        """
        # LSTM forward
        lstm_out, _ = self.lstm(x)
        
        # Take the last time step
        last_output = lstm_out[:, -1, :]
        
        # Fully connected layers
        output = self.fc(last_output)
        
        return output


class GRUModel(nn.Module):
    """GRU model for sequence forecasting"""
    
    def __init__(
        self,
        input_size: int,
        hidden_size: int,
        num_layers: int,
        output_size: int,
        dropout: float = 0.2,
        bidirectional: bool = False
    ):
        """
        Initialize GRU model
        
        Args:
            input_size: Number of input features
            hidden_size: GRU hidden size
            num_layers: Number of GRU layers
            output_size: Output dimension
            dropout: Dropout rate
            bidirectional: Use bidirectional GRU
        """
        super(GRUModel, self).__init__()
        
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.bidirectional = bidirectional
        
        self.gru = nn.GRU(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            dropout=dropout if num_layers > 1 else 0,
            bidirectional=bidirectional,
            batch_first=True
        )
        
        # Fully connected layer
        fc_input_size = hidden_size * 2 if bidirectional else hidden_size
        self.fc = nn.Sequential(
            nn.Linear(fc_input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_size, output_size),
            nn.Sigmoid()
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass
        
        Args:
            x: Input tensor (batch, seq_len, features)
            
        Returns:
            Output tensor (batch, output_size)
        """
        # GRU forward
        gru_out, _ = self.gru(x)
        
        # Take the last time step
        last_output = gru_out[:, -1, :]
        
        # Fully connected layers
        output = self.fc(last_output)
        
        return output


class DeepLearningBloomModel(BaseBloomModel):
    """Deep Learning (LSTM/GRU) model for bloom forecasting"""
    
    def __init__(
        self,
        config: Dict[str, Any],
        model_type: str = 'lstm',
        device: str = 'auto'
    ):
        """
        Initialize deep learning model
        
        Args:
            config: Model configuration
            model_type: 'lstm' or 'gru'
            device: 'cuda', 'cpu', or 'auto'
        """
        super().__init__(model_type, config)
        
        self.model_type = model_type
        
        # Set device
        if device == 'auto':
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        else:
            self.device = torch.device(device)
        
        print(f"🖥️  Using device: {self.device}")
        
        # Training parameters
        self.batch_size = config.get('batch_size', 32)
        self.epochs = config.get('epochs', 100)
        self.learning_rate = config.get('learning_rate', 0.001)
        self.patience = config.get('early_stopping_patience', 15)
        
        # Model architecture params
        self.input_size = None  # Set during build
        self.hidden_size = config.get('hidden_size', 128)
        self.num_layers = config.get('num_layers', 3)
        self.dropout = config.get('dropout', 0.2)
        self.bidirectional = config.get('bidirectional', True)
        self.output_size = config.get('output_size', 1)
    
    def build_model(self, input_size: int) -> None:
        """
        Build model architecture
        
        Args:
            input_size: Number of input features
        """
        self.input_size = input_size
        
        if self.model_type == 'lstm':
            self.model = LSTMModel(
                input_size=input_size,
                hidden_size=self.hidden_size,
                num_layers=self.num_layers,
                output_size=self.output_size,
                dropout=self.dropout,
                bidirectional=self.bidirectional
            )
        elif self.model_type == 'gru':
            self.model = GRUModel(
                input_size=input_size,
                hidden_size=self.hidden_size,
                num_layers=self.num_layers,
                output_size=self.output_size,
                dropout=self.dropout,
                bidirectional=self.bidirectional
            )
        else:
            raise ValueError(f"Unknown model type: {self.model_type}")
        
        self.model = self.model.to(self.device)
        
        print(f"✅ Built {self.model_type.upper()} model")
        print(f"   Input size: {input_size}")
        print(f"   Hidden size: {self.hidden_size}")
        print(f"   Num layers: {self.num_layers}")
        print(f"   Bidirectional: {self.bidirectional}")
        print(f"   Total parameters: {sum(p.numel() for p in self.model.parameters()):,}")
    
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
            X_train: Training sequences
            y_train: Training labels
            X_val: Validation sequences
            y_val: Validation labels
            
        Returns:
            Training history
        """
        print(f"\n🚀 Training {self.model_type.upper()} model...")
        print(f"   Training samples: {len(X_train)}")
        print(f"   Sequence length: {X_train.shape[1]}")
        print(f"   Features: {X_train.shape[2]}")
        
        # Create datasets
        train_dataset = TimeSeriesDataset(X_train, y_train)
        train_loader = DataLoader(
            train_dataset,
            batch_size=self.batch_size,
            shuffle=True,
            num_workers=0
        )
        
        if X_val is not None:
            val_dataset = TimeSeriesDataset(X_val, y_val)
            val_loader = DataLoader(
                val_dataset,
                batch_size=self.batch_size,
                shuffle=False,
                num_workers=0
            )
        
        # Loss and optimizer
        criterion = nn.MSELoss()
        optimizer = torch.optim.Adam(self.model.parameters(), lr=self.learning_rate)
        scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, mode='min', factor=0.5, patience=10, verbose=True
        )
        
        # Training loop
        history = {'train_loss': [], 'val_loss': []}
        best_val_loss = float('inf')
        patience_counter = 0
        
        for epoch in range(self.epochs):
            # Training
            self.model.train()
            train_losses = []
            
            for batch_X, batch_y in train_loader:
                batch_X = batch_X.to(self.device)
                batch_y = batch_y.to(self.device)
                
                # Forward pass
                outputs = self.model(batch_X).squeeze()
                loss = criterion(outputs, batch_y)
                
                # Backward pass
                optimizer.zero_grad()
                loss.backward()
                torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
                optimizer.step()
                
                train_losses.append(loss.item())
            
            avg_train_loss = np.mean(train_losses)
            history['train_loss'].append(avg_train_loss)
            
            # Validation
            if X_val is not None:
                self.model.eval()
                val_losses = []
                
                with torch.no_grad():
                    for batch_X, batch_y in val_loader:
                        batch_X = batch_X.to(self.device)
                        batch_y = batch_y.to(self.device)
                        
                        outputs = self.model(batch_X).squeeze()
                        loss = criterion(outputs, batch_y)
                        val_losses.append(loss.item())
                
                avg_val_loss = np.mean(val_losses)
                history['val_loss'].append(avg_val_loss)
                
                scheduler.step(avg_val_loss)
                
                # Early stopping
                if avg_val_loss < best_val_loss:
                    best_val_loss = avg_val_loss
                    patience_counter = 0
                else:
                    patience_counter += 1
                
                if (epoch + 1) % 10 == 0:
                    print(f"Epoch [{epoch+1}/{self.epochs}] "
                          f"Train Loss: {avg_train_loss:.4f} | "
                          f"Val Loss: {avg_val_loss:.4f}")
                
                if patience_counter >= self.patience:
                    print(f"\n⏹️  Early stopping at epoch {epoch+1}")
                    break
            else:
                if (epoch + 1) % 10 == 0:
                    print(f"Epoch [{epoch+1}/{self.epochs}] Train Loss: {avg_train_loss:.4f}")
        
        self.is_trained = True
        print(f"✅ Training completed!")
        
        return history
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make predictions
        
        Args:
            X: Input sequences
            
        Returns:
            Predictions
        """
        if not self.is_trained:
            raise RuntimeError("Model must be trained before prediction")
        
        self.model.eval()
        
        dataset = TimeSeriesDataset(X, np.zeros((len(X), self.output_size)))
        loader = DataLoader(dataset, batch_size=self.batch_size, shuffle=False)
        
        predictions = []
        
        with torch.no_grad():
            for batch_X, _ in loader:
                batch_X = batch_X.to(self.device)
                outputs = self.model(batch_X)
                predictions.append(outputs.cpu().numpy())
        
        return np.concatenate(predictions, axis=0)
    
    def save(self, save_dir: Path) -> None:
        """Save model to disk"""
        save_dir = Path(save_dir)
        save_dir.mkdir(parents=True, exist_ok=True)
        
        # Save model weights
        model_path = save_dir / f"{self.model_name}_weights.pth"
        torch.save(self.model.state_dict(), model_path)
        
        # Save configuration
        config = {
            'model_type': self.model_type,
            'input_size': self.input_size,
            'hidden_size': self.hidden_size,
            'num_layers': self.num_layers,
            'dropout': self.dropout,
            'bidirectional': self.bidirectional,
            'output_size': self.output_size,
            'is_trained': self.is_trained
        }
        
        config_path = save_dir / f"{self.model_name}_config.json"
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"✅ Model saved to {save_dir}")
    
    def load(self, load_dir: Path) -> None:
        """Load model from disk"""
        load_dir = Path(load_dir)
        
        # Load configuration
        config_path = load_dir / f"{self.model_name}_config.json"
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Build model
        self.input_size = config['input_size']
        self.build_model(self.input_size)
        
        # Load weights
        model_path = load_dir / f"{self.model_name}_weights.pth"
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        
        self.is_trained = config['is_trained']
        
        print(f"✅ Model loaded from {load_dir}")

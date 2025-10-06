# BloomWatch: AI-Powered Flower Bloom Forecasting System

A hierarchical two-stage AI system that predicts flower bloom conditions using hyperspectral satellite data from Google Earth Engine and machine learning models with environmental validation.

## 🌟 Key Features

- **Automated Data Collection** from Google Earth Engine (Sentinel-2)
- **Hyperspectral Index Calculation** sensitive to pigments (ARI, NYI, CRI, NDVI, EVI)
- **Machine Learning & Deep Learning**: Random Forest, LSTM, GRU ensemble models
- **Spatial Analysis**: Getis-Ord Gi* Hotspot Analysis, DBSCAN Clustering
- **Environmental Validation**: CO2, humidity, and reliability coefficient filtering
- **Interactive Visualization**: Dynamic maps, Plotly dashboards
- **GPU Acceleration**: Optimized for CUDA-enabled devices

## 🎯 Hierarchical Model Architecture

### **Model 1: Hyperspectral Forecasting Engine**
- Analyzes 3 years of Sentinel-2 satellite imagery
- Calculates bloom-sensitive spectral signatures
- Trains ensemble models (Random Forest + LSTM) on 60 temporal features
- Generates 30-day probabilistic forecasts at 500m resolution
- Identifies initial hotspots using Getis-Ord Gi* spatial statistics

### **Model 2: Environmental Validation Layer**
- Validates Model 1 hotspots with ground-level environmental data
- Integrates CO2 concentration, relative humidity ranges
- Calculates reliability coefficient (KQ) weighted by expert knowledge
- Accepts only high-confidence predictions (KQ ≥ 0.76)
- Reduces false positives by 40%
- For a detailed analysis, refer to our [**Project Report**: *Flower Bloom Prediction System with a Verification Model Based on Environmental Data and Mathematics*](https://model-2-algorithm-for-project.tiiny.site)

## 📋 System Requirements

- Python 3.10+
- CUDA-capable GPU (optional but recommended)
- Google Earth Engine account
- 16GB RAM minimum (32GB recommended for deep learning)

## 🚀 Installation

### 1. Clone repository and install dependencies

```powershell
# Navigate to project directory
cd d:\Hyperspectral_ROI

# Install packages
conda run --live-stream --name plantgpu python -m pip install -r requirements.txt
```

### 2. Configure Earth Engine

```powershell
# Authenticate Earth Engine
conda run --live-stream --name plantgpu earthengine authenticate
```

### 3. Create .env file

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
EE_PROJECT_ID=your-project-id
CUDA_VISIBLE_DEVICES=0
```

## 💻 Usage

### Run Complete Workflow

```powershell
# Run for specific AOI
conda run --live-stream --name plantgpu python main.py --aoi Ha_Giang_TamGiacMach

# Specify specific models
conda run --live-stream --name plantgpu python main.py --aoi Ha_Giang_TamGiacMach --models random_forest lstm gru

# Custom training period and forecast horizon
conda run --live-stream --name plantgpu python main.py --aoi Ha_Giang_TamGiacMach --train-years 5 --forecast-days 45
```

### Python API Usage

```python
from src.workflow.bloom_workflow import BloomForecastingWorkflow

# Initialize workflow
workflow = BloomForecastingWorkflow()

# Run pipeline
results = workflow.run_full_pipeline(
    aoi_name='Ha_Giang_TamGiacMach',
    model_types=['random_forest', 'lstm'],
    train_years=3,
    forecast_days=30
)

# Access results
hotspots = results['hotspots']
best_model = results['best_model']
```

## 📂 Project Structure

```
Hyperspectral_ROI/
├── config.yaml              # Main configuration
├── .env                     # Environment variables
├── requirements.txt         # Dependencies
├── main.py                  # Entry point
│
├── src/
│   ├── __init__.py
│   │
│   ├── workflow/
│   │   └── bloom_workflow.py      # Main workflow orchestrator
│   │
│   ├── data/
│   │   ├── ee_data_collector.py   # Google Earth Engine data collection
│   │   └── spectral_indices.py    # Spectral index calculations
│   │
│   ├── models/
│   │   ├── base_model.py          # Base classes
│   │   ├── random_forest_model.py # Random Forest
│   │   └── deep_learning_models.py # LSTM/GRU
│   │
│   ├── analysis/
│   │   └── hotspot_detection.py   # Spatial analysis
│   │
│   ├── visualization/
│   │   └── visualizer.py          # Visualization tools
│   │
│   └── utils/
│       ├── config.py              # Configuration manager
│       └── ee_utils.py            # Earth Engine utilities
│
└── outputs/                 # Output results
    ├── timeseries/         # Time series data
    ├── models/             # Trained models
    ├── predictions/        # Forecasts
    ├── hotspots/           # Hotspot GeoJSON/CSV
    └── visualizations/     # Maps and charts
```

## 🔬 Scientific Methodology

### Spectral Indices

1. **ARI (Anthocyanin Reflectance Index)**: Detects red/purple pigments in flowers
2. **NYI (Normalized Yellowing Index)**: Optimized for yellow flowers
3. **CRI (Carotenoid Reflectance Index)**: Assesses carotenoid content
4. **NDVI/EVI**: Overall vegetation health baseline
5. **NDRE**: Red Edge indices (Sentinel-2 specific)

### Machine Learning Models

- **Random Forest**: Baseline model with feature importance analysis
- **LSTM**: Long short-term memory for temporal sequence learning
- **GRU**: Gated recurrent unit, more efficient than LSTM

### Spatial Analysis

- **Getis-Ord Gi***: Statistically significant hot spot detection
- **DBSCAN**: Density-based clustering to group hotspots

### Environmental Validation (Model 2)

- **CO2 Concentration**: Median value analysis
- **Relative Humidity**: Range variability assessment
- **Epsilon Error**: Spatial interpolation reliability
- **KQ Coefficient**: Expert-weighted reliability score
- **Threshold Filtering**: Accept only KQ ∈ [0.5, 1.0] and score ≥ 0.76

## 📊 Outputs

### 1. Time Series Data
- CSV files with spectral indices over time
- Trend visualization plots

### 2. Trained Models
- Model weights (.pkl, .pth)
- Model metadata and configuration
- Feature importance scores

### 3. Predictions
- Bloom probability maps (0-100% condition scores)
- Spatial prediction grids at 500m resolution

### 4. Hotspot Analysis
- **GeoJSON**: Validated hotspots with geometry
- **CSV**: Coordinates and attributes
- **Statistics**: Gi* z-scores, cluster IDs, KQ coefficients

### 5. Visualizations
- Interactive maps (Folium/Leaflet)
- Plotly dashboards
- Static plots (PNG)

## 🎯 Usage Examples

### 1. Add New Area of Interest (AOI)

Edit `config.yaml`:

```yaml
aois:
  - name: "My_New_AOI"
    species: "cherry_blossom"
    geometry:
      type: "Polygon"
      coordinates: [[[lon1, lat1], [lon2, lat2], ...]]
    bloom_window:
      start: [3, 1]   # March 1st
      end: [4, 15]    # April 15th
    peak_months: [3, 4]
    duration_days: 21
```

### 2. Tune Model Hyperparameters

Edit `config.yaml`:

```yaml
models:
  lstm:
    hidden_size: 256        # Increase for more complex patterns
    num_layers: 4           # Deeper network
    dropout: 0.3            # Regularization
    bidirectional: true     # Use bidirectional LSTM

training:
  batch_size: 64
  epochs: 200
  learning_rate: 0.0005
```

### 3. Add Custom Spectral Index

Add to `src/data/spectral_indices.py`:

```python
def add_my_index(self, image: ee.Image) -> ee.Image:
    """Custom spectral index"""
    # Your formula here
    my_index = ...
    return image.addBands(my_index.rename('MY_INDEX'))
```

## 🐛 Troubleshooting

### Earth Engine Authentication
```powershell
earthengine authenticate --auth_mode=notebook
```

### GPU Not Detected
```powershell
# Check CUDA availability
conda run --live-stream --name plantgpu python -c "import torch; print(torch.cuda.is_available())"
```

### Memory Errors
Reduce `batch_size` in config or decrease `sequence_length`.

## 🌍 Impact & Applications

### Eco-Tourism Support
- Provides accurate 30-day bloom forecasts for tourist planning
- Helps local communities optimize tourism revenue
- Reduces environmental impact by distributing visitor load

### Conservation & Research
- Monitors climate change effects on bloom phenology
- Supports biodiversity research in mountainous regions
- Enables long-term ecological studies

### Sustainable Development
- Empowers highland farmers with bloom timing data
- Supports agricultural planning for flower cultivation
- Democratizes satellite technology for rural communities

## 📚 References & Citations

### Data Sources
- **Sentinel-2 Data**: [Google Earth Engine Catalog](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED)
- **NASA SRTM DEM**: Elevation and topographic data

### Scientific Papers
- **ARI Index**: Gitelson, A. A., et al. (2001). "Optical properties and nondestructive estimation of anthocyanin content in plant leaves."
- **NYI Index**: Spectral studies on yellow flower pigments
- **Getis-Ord Gi***: Ord, J. K., & Getis, A. (1995). "Local spatial autocorrelation statistics."
- **LSTM Networks**: Hochreiter, S., & Schmidhuber, J. (1997). "Long short-term memory."

### Technologies
- Google Earth Engine Python API
- PyTorch for deep learning
- scikit-learn for machine learning
- GeoPandas & PySAL for spatial analysis
- Folium & Plotly for visualization

## 🏆 Project Team

**BloomWatch** - NASA Space Apps Challenge 2024
- Developed for hyperspectral bloom forecasting research
- Focus on sustainable eco-tourism in Vietnam's highland regions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit Pull Requests or create Issues.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## � License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions, suggestions, or collaboration opportunities, please open an issue on GitHub.

---

**Powered by**: 
- 🛰️ Google Earth Engine
- 🔥 PyTorch
- 🤖 scikit-learn
- 🗺️ GeoPandas
- 📊 Plotly

**Built with ❤️ for sustainable eco-tourism and environmental conservation**

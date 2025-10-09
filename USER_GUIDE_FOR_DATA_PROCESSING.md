# 🌸 Bloom Forecasting System - User Guide for Data Processing

## 🎯 Main Features

Predict **flower bloom probability** for any date (past or future) for regions in Ha Giang, Vietnam.

### Input: 
- **Prediction date**: For example, June 20, 2020, November 15, 2025, or current date

### Output:
1. **Heatmap** of the entire region with bloom probability gradient (0-100%)
2. **List of hotspots** with probability >80% including precise coordinates
3. **Interactive map** - click any point to view probability

---

## 🚀 How to Use

### 1. Predict for a SPECIFIC DATE

```bash
# Predict for June 20, 2020
python main.py --aoi Ha_Giang_TamGiacMach --date 2020-06-20

# Predict for November 15, 2025 (future)
python main.py --aoi Ha_Giang_TamGiacMach --date 2025-11-15
```

### 2. Predict for CURRENT DATE

```bash
python main.py --aoi Ha_Giang_TamGiacMach
```

---

## 📊 Results

After running (5-10 minutes), check:

### 1. **Interactive Map**
```
outputs/visualizations/Ha_Giang_TamGiacMach/Ha_Giang_TamGiacMach_hotspots_map.html
```
- Open HTML file in browser
- Heatmap color gradient: Blue (low) → Yellow → Red (high)
- Click any point to see exact probability
- Hotspots >80% are clearly marked

### 2. **Hotspots List (CSV)**
```
outputs/hotspots/Ha_Giang_TamGiacMach/Ha_Giang_TamGiacMach_hotspots.csv
```
Contains:
- Coordinates (longitude, latitude)
- Bloom probability (%)
- Gi* z-score (hotspot index)
- Cluster ID

### 3. **GeoJSON Data**
```
outputs/hotspots/Ha_Giang_TamGiacMach/Ha_Giang_TamGiacMach_hotspots.geojson
```
- Import into QGIS/ArcGIS for further analysis

---

## 🤖 Models Used

The system trains 3 models and selects the best one:

1. **Random Forest** - Fast, stable
2. **LSTM** - Learns temporal patterns  
3. **GRU** - Similar to LSTM but lighter

---

## 📈 Usage Scenarios

### Scenario 1: Historical Analysis
```
Question: "Which locations had the highest bloom on June 20, 2020?"

Run: python main.py --aoi Ha_Giang_TamGiacMach --date 2020-06-20

Results: 
- Heatmap displays entire region
- List of 15 hotspots with probability >80%
- Click each point to see details
```

### Scenario 2: Future Forecasting
```
Question: "Where should I go for flower viewing on November 15, 2025?"

Run: python main.py --aoi Ha_Giang_TamGiacMach --date 2025-11-15

Results:
- Predict bloom probability for entire region
- Recommend TOP 10 locations with highest probability
```

---

## ⚙️ Advanced Customization

### Change Hotspot Threshold

Default: 50% (to get more hotspots)

If you want to see only highly certain bloom locations:

```bash
python main.py --aoi Ha_Giang_TamGiacMach --date 2020-06-20 --threshold 0.8
```

### Use Only One Model

```bash
# Random Forest only (fastest)
python main.py --aoi Ha_Giang_TamGiacMach --models random_forest

# LSTM only (most accurate)
python main.py --aoi Ha_Giang_TamGiacMach --models lstm
```

---

## 📁 Output Structure

```
outputs/
├── timeseries/          # Time series data collected from Sentinel-2
├── models/              # Trained models (reusable)
├── predictions/         # Raw predictions
├── hotspots/            # Hotspots CSV + GeoJSON
└── visualizations/      # HTML maps + PNG charts
    └── Ha_Giang_TamGiacMach/
        ├── *_hotspots_map.html  👈 MAIN MAP
        ├── *_timeseries.png
        └── *_dashboard.html
```

---

## 🔧 Troubleshooting

### Error: "Hotspots = 0"
→ Lower threshold: `--threshold 0.3`

### Error: Earth Engine timeout
→ Reduce train_years: `--train-years 2`

### Want to run faster
→ Use Random Forest only: `--models random_forest`

---

## 📞 Support

If you need additional features:
- Add new regions (Moc Chau, Da Lat...)
- Export PNG images instead of HTML
- Integrate API for web app queries

Edit `config.yaml` and `main.py` files

---

## 🔄 Data Processing Workflow

### Step-by-Step Process:

1. **Data Collection**
   - Authenticate with Google Earth Engine
   - Fetch Sentinel-2 satellite imagery
   - Extract spectral indices (ARI, NYI, CRI, NDVI, EVI)

2. **Model Training**
   - Load historical time series data
   - Train ensemble models (RF, LSTM, GRU)
   - Validate model performance
   - Save best performing model

3. **Prediction Generation**
   - Load trained model
   - Generate predictions for target date
   - Calculate bloom probabilities

4. **Hotspot Detection**
   - Apply Getis-Ord Gi* spatial statistics
   - Identify statistically significant hotspots
   - Filter by probability threshold
   - Cluster nearby hotspots using DBSCAN

5. **Visualization**
   - Generate interactive maps
   - Create time series plots
   - Export GeoJSON and CSV files

### Command Line Options:

```bash
python main.py \
  --aoi Ha_Giang_TamGiacMach \     # Area of interest
  --date 2025-11-15 \               # Target date (optional)
  --models lstm gru \               # Models to use
  --train-years 3 \                 # Years of training data
  --threshold 0.5 \                 # Hotspot threshold
  --top-n 50                        # Number of top hotspots
```

### Batch Processing:

```bash
# Run for all areas sequentially
./predict_gpu_optimized.bat

# Run for all areas in parallel
./predict_parallel.bat

# Run for specific flowers
./predict_flowers.bat
```

This will process:
1. Ha Giang - Tam Giac Mach
2. Moc Chau - Prunus (Cherry Blossom)
3. Hoang Lien - Rhododendron (Fansipan)
4. Lao Cai - Rhododendron

---

## 📊 Understanding the Output

### Bloom Probability Score
- **0-30%**: Very low chance of bloom
- **30-50%**: Low to moderate chance
- **50-70%**: Moderate to high chance
- **70-85%**: High probability
- **85-100%**: Very high probability (peak bloom likely)

### Gi* Z-Score (Hotspot Intensity)
- **< -1.96**: Cold spot (significantly low bloom)
- **-1.96 to 1.96**: Random/neutral
- **1.96 to 2.58**: Hotspot (95% confidence)
- **> 2.58**: Very strong hotspot (99% confidence)

### Cluster ID
- Groups nearby hotspots together
- Useful for identifying continuous bloom areas
- `-1` indicates isolated points (no cluster)

---

## 🌐 Web Interface Integration

The processed data can be visualized using the web interface:
### For Linux server
```bash
# Start cronjob - prediction interval 1 min
./START_SERVER_CRONJOB.sh

# Start web application
python -m http.server [YOUR_PORT]
```

### For Windows server
```powershell
# Start cronjob - prediction interval 1 min
./START_SERVER_CRONJOB.bat

# Start web application
python -m http.server [YOUR_PORT]
``` 

Then open `http://localhost:[YOUR_PORT]` in your browser.

---

## 💡 Best Practices

1. **For Historical Analysis**: Use dates within the training period (last 3 years)
2. **For Future Predictions**: Results are more reliable for near-term forecasts (1-30 days)
3. **Threshold Selection**: 
   - Use 0.5 for exploration
   - Use 0.7-0.8 for planning
   - Use 0.85+ for high-confidence recommendations
4. **Model Selection**:
   - Use `random_forest` for quick results
   - Use `lstm gru` ensemble for best accuracy
5. **Regular Updates**: Run daily/weekly to update predictions with latest data

---

## 🗂️ Configuration File (config.yaml)

### Adding New Areas of Interest:

```yaml
aois:
  - name: "My_New_Region"
    species: "flower_species"
    geometry:
      type: "Polygon"
      coordinates: [[[lon1, lat1], [lon2, lat2], ...]]
    bloom_window:
      start: [3, 1]   # Month, Day
      end: [4, 15]
    peak_months: [3, 4]
    duration_days: 21
```

### Tuning Model Parameters:

```yaml
models:
  random_forest:
    n_estimators: 200
    max_depth: 20
    min_samples_split: 5
    
  lstm:
    hidden_size: 128
    num_layers: 3
    dropout: 0.2
    bidirectional: true
    
  gru:
    hidden_size: 128
    num_layers: 3
    dropout: 0.2
```

### Training Configuration:

```yaml
training:
  batch_size: 32
  epochs: 150
  learning_rate: 0.001
  early_stopping_patience: 20
  validation_split: 0.2
```

---

## 🎓 Technical Details

### Spectral Indices Used:

- **ARI** (Anthocyanin Reflectance Index): `1/B3 - 1/B5`
- **NYI** (Normalized Yellowing Index): `(B3 - B8) / (B3 + B8)`
- **CRI** (Carotenoid Reflectance Index): `1/B2 - 1/B5`
- **NDVI** (Normalized Difference Vegetation Index): `(B8 - B4) / (B8 + B4)`
- **EVI** (Enhanced Vegetation Index): `2.5 * (B8 - B4) / (B8 + 6*B4 - 7.5*B2 + 1)`

### Sentinel-2 Bands:
- B2: Blue (490 nm)
- B3: Green (560 nm)
- B4: Red (665 nm)
- B5: Red Edge 1 (705 nm)
- B8: NIR (842 nm)

### Spatial Analysis:
- **Resolution**: 500m grid
- **Hotspot Detection**: Getis-Ord Gi* with 95% confidence
- **Clustering**: DBSCAN with eps=0.01, min_samples=3

---

**Last Updated**: October 9, 2025

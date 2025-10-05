# Installation and Usage Guide

## 🚀 Quick Start (5 phút)

### Bước 1: Cài đặt Dependencies

```powershell
# Di chuyển vào thư mục dự án
cd d:\Hyperspectral_ROI

# Cài đặt tất cả packages cần thiết
conda run --live-stream --name plantgpu python -m pip install -r requirements.txt
```

### Bước 2: Xác thực Earth Engine

```powershell
conda run --live-stream --name plantgpu earthengine authenticate
```

Làm theo hướng dẫn để đăng nhập vào Google Earth Engine.

### Bước 3: Tạo file .env

```powershell
cp .env.example .env
```

Chỉnh sửa `.env` và thêm Earth Engine Project ID của bạn:
```
EE_PROJECT_ID=genial-upgrade-467713-n9
```

### Bước 4: Chạy Workflow

Cách 1 - Sử dụng batch script (Windows):
```powershell
.\run_workflow.bat
```

Cách 2 - Chạy trực tiếp:
```powershell
conda run --live-stream --name plantgpu python main.py --aoi Ha_Giang_TamGiacMach
```

## 📖 Hướng dẫn chi tiết

### Kiểm tra GPU

Trước khi bắt đầu, kiểm tra xem hệ thống có nhận GPU không:

```powershell
conda run --live-stream --name plantgpu python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}'); print(f'Device: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"CPU\"}')"
```

Nếu CUDA không available, hệ thống vẫn chạy được nhưng sẽ chậm hơn.

### Tùy chỉnh AOI

1. Mở file `config.yaml`
2. Thêm AOI mới trong section `aois`:

```yaml
aois:
  - name: "My_Custom_AOI"
    species: "cherry_blossom"  # Loại hoa
    geometry:
      type: "Polygon"
      coordinates: [[[lon1, lat1], [lon2, lat2], [lon3, lat3], [lon4, lat4], [lon1, lat1]]]
    bloom_window:
      start: [3, 15]   # Tháng 3, ngày 15
      end: [4, 30]     # Tháng 4, ngày 30
    peak_months: [4]   # Tháng đỉnh nở
    duration_days: 20  # Thời gian nở
```

3. Chạy workflow cho AOI mới:

```powershell
python main.py --aoi My_Custom_AOI
```

### Tùy chỉnh Models

Trong `config.yaml`, điều chỉnh hyperparameters:

```yaml
models:
  random_forest:
    n_estimators: 300      # Số cây (tăng = chính xác hơn, chậm hơn)
    max_depth: 25          # Độ sâu tối đa
    
  lstm:
    hidden_size: 128       # Kích thước hidden layer
    num_layers: 3          # Số layers
    dropout: 0.2           # Dropout rate
    bidirectional: true    # Sử dụng Bi-LSTM

training:
  batch_size: 32           # Batch size (giảm nếu thiếu RAM)
  epochs: 100              # Số epochs
  learning_rate: 0.001     # Learning rate
  early_stopping_patience: 15  # Early stopping
```

### Chọn Models để Train

```powershell
# Chỉ Random Forest
python main.py --aoi Ha_Giang_TamGiacMach --models random_forest

# Random Forest + LSTM
python main.py --aoi Ha_Giang_TamGiacMach --models random_forest lstm

# Tất cả models
python main.py --aoi Ha_Giang_TamGiacMach --models random_forest lstm gru
```

### Tùy chỉnh Training Period

```powershell
# Sử dụng 5 năm dữ liệu lịch sử
python main.py --aoi Ha_Giang_TamGiacMach --train-years 5

# Dự báo 60 ngày tới
python main.py --aoi Ha_Giang_TamGiacMach --forecast-days 60
```

## 🔍 Phân tích Kết quả

### 1. Time Series Data

Tìm trong `outputs/timeseries/`:
- CSV files chứa spectral indices theo thời gian
- Plots (.png) thể hiện xu hướng

```python
import pandas as pd
ts_df = pd.read_csv('outputs/timeseries/Ha_Giang_TamGiacMach_timeseries.csv')
print(ts_df.head())
```

### 2. Trained Models

Tìm trong `outputs/models/`:
- `random_forest/`: Random Forest model
- `lstm/`: LSTM model
- Mỗi folder chứa model weights và metadata

Load model để sử dụng lại:

```python
from src.models.random_forest_model import RandomForestBloomModel

model = RandomForestBloomModel({}, task='regression')
model.load('outputs/models/random_forest')
```

### 3. Hotspots

Tìm trong `outputs/hotspots/`:
- `*_hotspots.geojson`: Dữ liệu không gian (mở trong QGIS/ArcGIS)
- `*_hotspots.csv`: Bảng với lon/lat và probability
- `*_summary.json`: Thống kê tổng hợp

```python
import geopandas as gpd
hotspots = gpd.read_file('outputs/hotspots/Ha_Giang_TamGiacMach/Ha_Giang_TamGiacMach_hotspots.geojson')
print(f"Số hotspots: {len(hotspots)}")
print(hotspots.head())
```

### 4. Visualizations

Tìm trong `outputs/visualizations/`:
- `*_timeseries.png`: Time series plots
- `*_hotspots_map.html`: Bản đồ tương tác (mở trong browser)

Mở bản đồ:
```powershell
start outputs/visualizations/Ha_Giang_TamGiacMach/Ha_Giang_TamGiacMach_hotspots_map.html
```

## 🐍 Sử dụng trong Python Script

```python
from src.workflow.bloom_workflow import BloomForecastingWorkflow

# Khởi tạo
workflow = BloomForecastingWorkflow(config_path='config.yaml')

# Chạy full pipeline
results = workflow.run_full_pipeline(
    aoi_name='Ha_Giang_TamGiacMach',
    model_types=['random_forest', 'lstm'],
    train_years=3,
    forecast_days=30
)

# Truy cập kết quả
print(f"Best model: {results['best_model']}")
print(f"Number of hotspots: {len(results['hotspots'])}")

# Top 10 hotspots
top_10 = results['top_hotspots'].head(10)
print(top_10[['lon', 'lat', 'bloom_probability', 'gi_star_z']])

# Export thêm
results['hotspots'].to_file('my_custom_export.geojson', driver='GeoJSON')
```

## 🔧 Tùy chỉnh Nâng cao

### 1. Thêm Spectral Index mới

Chỉnh sửa `src/data/spectral_indices.py`:

```python
def add_custom_index(self, image: ee.Image) -> ee.Image:
    """Custom spectral index for specific flower type"""
    b2 = image.select('B2').multiply(1/10000)
    b3 = image.select('B3').multiply(1/10000)
    b4 = image.select('B4').multiply(1/10000)
    
    # Your formula
    custom = (b2.subtract(b4)).divide(b3.add(1e-3))
    
    return image.addBands(custom.rename('CUSTOM_INDEX'))
```

Thêm vào `add_all_indices()`:
```python
def add_all_indices(self, image: ee.Image) -> ee.Image:
    # ...existing code...
    image = self.add_custom_index(image)
    return image
```

### 2. Custom Model Architecture

Tạo file mới `src/models/custom_model.py`:

```python
from .base_model import BaseBloomModel

class CustomBloomModel(BaseBloomModel):
    def __init__(self, config):
        super().__init__('custom_model', config)
        # Your initialization
    
    def build_model(self):
        # Build your model
        pass
    
    def train(self, X_train, y_train, X_val, y_val):
        # Training logic
        pass
    
    def predict(self, X):
        # Prediction logic
        pass
```

### 3. Custom Hotspot Ranking

Chỉnh sửa `src/analysis/hotspot_detection.py`:

```python
def rank_hotspots_custom(self, gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Custom ranking based on multiple criteria"""
    # Normalize multiple factors
    prob_norm = (gdf['bloom_probability'] - gdf['bloom_probability'].min()) / \
                (gdf['bloom_probability'].max() - gdf['bloom_probability'].min())
    
    gi_norm = (gdf['gi_star_z'] - gdf['gi_star_z'].min()) / \
              (gdf['gi_star_z'].max() - gdf['gi_star_z'].min())
    
    # Custom weighting
    gdf['custom_score'] = (0.5 * prob_norm + 
                          0.3 * gi_norm + 
                          0.2 * some_other_factor)
    
    gdf['rank'] = gdf['custom_score'].rank(ascending=False)
    return gdf.sort_values('rank')
```

## 📊 Performance Tips

### GPU Optimization

Tăng batch size nếu có nhiều VRAM:
```yaml
training:
  batch_size: 64  # hoặc 128 nếu GPU mạnh
```

### Memory Optimization

Nếu thiếu RAM:
1. Giảm `train_years`: từ 3 xuống 2
2. Giảm `batch_size`: từ 32 xuống 16
3. Giảm `sequence_length` trong code (mặc định 30)

### Speed Optimization

1. Sử dụng ít models hơn: chỉ random_forest hoặc chỉ lstm
2. Giảm số `epochs`: từ 100 xuống 50
3. Tăng `early_stopping_patience`: training dừng sớm hơn

## 🐛 Troubleshooting

### Lỗi: "Earth Engine not initialized"

```powershell
earthengine authenticate
```

### Lỗi: "CUDA out of memory"

Giảm batch_size trong config.yaml:
```yaml
training:
  batch_size: 16  # Giảm từ 32
```

### Lỗi: Import errors

Cài lại dependencies:
```powershell
conda run --live-stream --name plantgpu python -m pip install -r requirements.txt --upgrade
```

### Lỗi: "No module named 'src'"

Chạy từ thư mục gốc:
```powershell
cd d:\Hyperspectral_ROI
python main.py --aoi Ha_Giang_TamGiacMach
```

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong console
2. Kiểm tra file outputs/*/summary.json
3. Đảm bảo Earth Engine đã authenticate
4. Kiểm tra GPU với `nvidia-smi` (Windows)

---

Happy Forecasting! 🌸🌼🌺

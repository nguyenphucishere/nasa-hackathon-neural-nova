# Bloom Forecasting System

Hệ thống dự báo xác suất nở hoa sử dụng dữ liệu hyperspectral từ Google Earth Engine và Machine Learning/Deep Learning.

## 🌟 Tính năng

- **Thu thập dữ liệu tự động** từ Google Earth Engine (Sentinel-2)
- **Tính toán chỉ số quang phổ** nhạy cảm với sắc tố (ARI, NYI, CRI, NDVI, EVI)
- **Machine Learning & Deep Learning**: Random Forest, LSTM, GRU
- **Phân tích không gian**: Getis-Ord Gi* Hotspot Analysis, DBSCAN Clustering
- **Visualization**: Bản đồ tương tác, dashboard Plotly
- **GPU Support**: Tối ưu cho máy có GPU

## 📋 Yêu cầu hệ thống

- Python 3.10+
- CUDA-capable GPU (optional, nhưng khuyến khích)
- Google Earth Engine account
- 16GB RAM (khuyến khích 32GB cho deep learning)

## 🚀 Cài đặt

### 1. Clone repository và cài đặt dependencies

```powershell
# Di chuyển vào thư mục dự án
cd d:\Hyperspectral_ROI

# Cài đặt packages
conda run --live-stream --name plantgpu python -m pip install -r requirements.txt
```

### 2. Cấu hình Earth Engine

```powershell
# Authenticate Earth Engine
conda run --live-stream --name plantgpu earthengine authenticate
```

### 3. Tạo file .env

Copy `.env.example` thành `.env` và điền thông tin:

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:
```
EE_PROJECT_ID=your-project-id
CUDA_VISIBLE_DEVICES=0
```

## 💻 Sử dụng

### Chạy workflow hoàn chỉnh

```powershell
# Chạy cho một AOI cụ thể
conda run --live-stream --name plantgpu python main.py --aoi Ha_Giang_TamGiacMach

# Chỉ định models cụ thể
conda run --live-stream --name plantgpu python main.py --aoi Ha_Giang_TamGiacMach --models random_forest lstm gru

# Custom training period và forecast horizon
conda run --live-stream --name plantgpu python main.py --aoi Ha_Giang_TamGiacMach --train-years 5 --forecast-days 45
```

### Sử dụng trong Python

```python
from src.workflow.bloom_workflow import BloomForecastingWorkflow

# Khởi tạo workflow
workflow = BloomForecastingWorkflow()

# Chạy pipeline
results = workflow.run_full_pipeline(
    aoi_name='Ha_Giang_TamGiacMach',
    model_types=['random_forest', 'lstm'],
    train_years=3,
    forecast_days=30
)

# Truy cập kết quả
hotspots = results['hotspots']
best_model = results['best_model']
```

## 📂 Cấu trúc dự án

```
Hyperspectral_ROI/
├── config.yaml              # Cấu hình chính
├── .env                     # Biến môi trường
├── requirements.txt         # Dependencies
├── main.py                  # Entry point
│
├── src/
│   ├── __init__.py
│   │
│   ├── workflow/
│   │   └── bloom_workflow.py      # Workflow agent chính
│   │
│   ├── data/
│   │   ├── ee_data_collector.py   # Thu thập dữ liệu từ GEE
│   │   └── spectral_indices.py    # Tính toán chỉ số quang phổ
│   │
│   ├── models/
│   │   ├── base_model.py          # Base classes
│   │   ├── random_forest_model.py # Random Forest
│   │   └── deep_learning_models.py # LSTM/GRU
│   │
│   ├── analysis/
│   │   └── hotspot_detection.py   # Phân tích không gian
│   │
│   ├── visualization/
│   │   └── visualizer.py          # Visualization tools
│   │
│   └── utils/
│       ├── config.py              # Configuration manager
│       └── ee_utils.py            # Earth Engine utilities
│
└── outputs/                 # Kết quả đầu ra
    ├── timeseries/         # Chuỗi thời gian
    ├── models/             # Mô hình đã train
    ├── predictions/        # Dự báo
    ├── hotspots/           # Hotspot GeoJSON/CSV
    └── visualizations/     # Bản đồ, biểu đồ
```

## 🔬 Phương pháp khoa học

### Chỉ số Quang phổ

1. **ARI (Anthocyanin Reflectance Index)**: Phát hiện sắc tố đỏ/tím
2. **NYI (Normalized Yellowing Index)**: Tối ưu cho hoa vàng
3. **CRI (Carotenoid Reflectance Index)**: Đánh giá carotenoid
4. **NDVI/EVI**: Sức khỏe thực vật tổng quát
5. **NDRE**: Red Edge indices (Sentinel-2)

### Machine Learning Models

- **Random Forest**: Baseline model, feature importance analysis
- **LSTM**: Long short-term memory cho chuỗi thời gian
- **GRU**: Gated recurrent unit, hiệu quả hơn LSTM

### Spatial Analysis

- **Getis-Ord Gi***: Hot spot analysis có ý nghĩa thống kê
- **DBSCAN**: Density-based clustering để nhóm hotspots

## 📊 Đầu ra

### 1. Time Series Data
- CSV files với spectral indices theo thời gian
- Plots thể hiện xu hướng

### 2. Trained Models
- Model weights (.pkl, .pth)
- Model metadata và configuration
- Feature importance scores

### 3. Predictions
- Bloom probability maps
- Spatial prediction grids

### 4. Hotspot Analysis
- **GeoJSON**: Hotspots với geometry
- **CSV**: Coordinates và attributes
- **Statistics**: Gi* z-scores, cluster info

### 5. Visualizations
- Interactive maps (Folium/Leaflet)
- Plotly dashboards
- Static plots (PNG)

## 🎯 Ví dụ sử dụng

### 1. Thêm AOI mới

Chỉnh sửa `config.yaml`:

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

### 2. Tuning model hyperparameters

Chỉnh sửa `config.yaml`:

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

### 3. Custom spectral index

Thêm vào `src/data/spectral_indices.py`:

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

### GPU not detected
```powershell
# Check CUDA
conda run --live-stream --name plantgpu python -c "import torch; print(torch.cuda.is_available())"
```

### Memory errors
Giảm `batch_size` trong config hoặc giảm `sequence_length`.

## 📚 Tài liệu tham khảo

- Sentinel-2 Data: https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED
- ARI Index: Gitelson et al. (2001)
- NYI Index: Spectral studies on yellow flowers
- Getis-Ord Gi*: Ord & Getis (1995)

## 🤝 Đóng góp

Hoan nghênh mọi đóng góp! Vui lòng tạo Pull Request hoặc Issue.

## 📄 License

MIT License

## 📧 Liên hệ

Project developed for hyperspectral bloom forecasting research.

---
**Powered by**: Google Earth Engine, PyTorch, scikit-learn, GeoPandas

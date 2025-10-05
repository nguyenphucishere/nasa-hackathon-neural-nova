# 🌸 HƯỚNG DẪN DỰ BÁO 4 LOÀI HOA TÂY BẮC - CƠ SỞ KHOA HỌC

## 📋 MỤC LỤC

1. [Tổng quan 4 Loài Hoa](#tổng-quan-4-loài-hoa)
2. [Cơ sở Khoa học và Phân tích Quang phổ](#cơ-sở-khoa-học)
3. [Kiến trúc Mô hình Tiên tiến](#kiến-trúc-mô-hình)
4. [Hướng dẫn Sử dụng](#hướng-dẫn-sử-dụng)
5. [Phương pháp Phân tích](#phương-pháp-phân-tích)

---

## 🌺 TỔNG QUAN 4 LOÀI HOA

### 1. TAM GIÁC MẠCH (Fagopyrum esculentum)
**Vùng**: Hà Giang (104.948°-105.45°E, 23.05°-23.274°N)

**Đặc điểm Sinh thái**:
- **Độ cao**: 800-1500m
- **Thời gian nở**: Tháng 9-12 (Peak: Tháng 10-11)
- **Thời gian nở rộ**: ~60 ngày
- **Loại hình**: Cây trồng nông nghiệp

**Chỉ số Quang phổ Chính**:
- NYI (Normalized Yellowing Index) - Phát hiện vàng hóa
- ARI (Anthocyanin) - Màu hồng/tím nhạt
- NDVI - Sức khỏe cây trồng

---

### 2. HOA MẬN (Prunus mume)
**Vùng**: Mộc Châu (104.45°-104.85°E, 20.72°-21.0°N)

**Đặc điểm Sinh thái**:
- **Độ cao**: 1000-1100m (Mộc Châu ~1050m)
- **Thời gian nở**: Cuối tháng 1 - Cuối tháng 2
- **Peak bloom**: 7-10 ngày đầu (CỰC KỲ NGẮN!)
- **Nhiệt độ**: 10-22°C, yêu cầu mùa đông lạnh
- **Loại hình**: Vườn cây ăn quả

**Thách thức Viễn thám**:
- ⚠️ Cửa sổ nở rộ cực ngắn (7-10 ngày)
- ⚠️ Cần chuỗi thời gian LSTM để nội suy
- ⚠️ Sentinel-2 (5 ngày) có thể bỏ lỡ peak

**Chỉ số Quang phổ Chính**:
- ARI2 (Anthocyanin Index 2) - Hoa trắng/hồng
- SR_ANTHO (Custom ratio) - R331/R581
- PSRI - Tỷ lệ carotenoid/chlorophyll

---

### 3. HOA ĐỖ QUYÊN - HOÀNG LIÊN SƠN (Rhododendron spp.)
**Vùng**: Fansipan (103.73°-103.95°E, 22.25°-22.42°N)

**Đặc điểm Sinh thái**:
- **Độ cao**: 1500-3200m (NÚI CAO)
- **Thời gian nở**: Tháng 3-5 (Peak: Tháng 4)
- **Thời gian nở rộ**: Kéo dài ~90 ngày
- **Độ dốc**: 10-60°
- **pH đất**: 4.2-6.0 (CỰC CHUA)
- **Ánh sáng**: Ưa bóng râm
- **Loại hình**: Rừng tự nhiên, vách đá

**Sắc tố Đặc trưng**:
- Màu hoa: Đỏ, hồng, tím, vàng, trắng
- **Anthocyanin CAO** (màu đỏ/tím)
- **Carotenoid** (màu vàng/cam)

**Chỉ số Quang phổ Đặc biệt**:
- **BLUE_RATIO (B02/B04)**: Dải 450nm - 80% accuracy phân biệt hoa/lá Đỗ quyên
- **ARI1, ARI2**: Phát hiện anthocyanin
- **CRI1, CRI2**: Phát hiện carotenoid
- **SR_ANTHO**: B01/B03 (tùy chỉnh từ R331/R581)
- **SR_CARO**: B01/B04 (tùy chỉnh từ R331/R631)

**Environmental Prior (Quan trọng!)**:
- Elevation > 1500m
- Slope: 10-60°
- Land cover: Forest, Shrubland
- Aspect: North, East (shade)

---

### 4. HOA ĐỖ QUYÊN - LÀO CAI (Rhododendron spp.)
**Vùng**: Putaleng (103.82°-104.05°E, 22.18°-22.35°N)

**Đặc điểm Sinh thái**:
- **Độ cao**: 2000-3400m (CAO HỚN FANSIPAN)
- **Thời gian nở**: Tháng 3-6 (muộn hơn, Peak: Tháng 4)
- **Thời gian nở rộ**: ~90 ngày

**Khác biệt với Fansipan**:
- Độ cao trung bình cao hơn
- Mùa hoa dài hơn (đến tháng 6)
- Địa hình hiểm trở hơn

---

## 🔬 CƠ SỞ KHOA HỌC

### Phản xạ Quang phổ của Sắc tố Hoa

#### 1. **Anthocyanin** (Màu Đỏ/Tím/Hồng)
```
Hấp thụ mạnh: Vùng xanh lục (~540-560nm)
→ Mắt người thấy: Màu đỏ/tím
→ Sentinel-2: Band B3 (560nm) hấp thụ
→ Chỉ số: ARI1 = (1/B03) - (1/B05)
         ARI2 = B08 * ((1/B03) - (1/B05))
```

**Ứng dụng**:
- Hoa Đỗ quyên đỏ/tím
- Hoa Mận hồng
- Tam Giác Mạch hồng

#### 2. **Carotenoid** (Màu Vàng/Cam)
```
Hấp thụ mạnh: Vùng xanh lam-lục (~450-510nm)
→ Mắt người thấy: Màu vàng/cam
→ Sentinel-2: Band B2 (490nm) hấp thụ
→ Chỉ số: CRI1 = (1/B02) - (1/B03)
         CRI2 = (1/B02) - (1/B05)
         PSRI = (B04 - B03) / B06
```

**Ứng dụng**:
- Hoa Đỗ quyên vàng
- Tam Giác Mạch (vàng hóa)

#### 3. **Chỉ số Tùy chỉnh từ Nghiên cứu**

Dựa trên phân tích tương quan trực tiếp:

```python
# Anthocyanin (R² = 0.67)
SR_ANTHO = R_331nm / R_581nm
# Sentinel-2 adaptation:
SR_ANTHO ≈ B01 / B03  # B01 (443nm) ~ UV-A, B03 (560nm) ~ 581nm

# Carotenoid (R² = 0.68)
SR_CARO = R_331nm / R_631nm
# Sentinel-2 adaptation:
SR_CARO ≈ B01 / B04  # B04 (665nm) ~ 631nm
```

#### 4. **Đỗ Quyên-Specific: Blue Band**

Nghiên cứu cho thấy:
```
R_450nm (Blue) → 80% accuracy phân biệt hoa/lá Rhododendron
→ Sentinel-2: B02 (490nm) gần nhất
→ Chỉ số: BLUE_RATIO = B02 / B04
```

---

### Vấn đề Mixed Pixels

**Thách thức**:
- Sentinel-2: 20m resolution
- Mỗi pixel chứa: Hoa + Lá + Cành + Bóng + Đất
- Phân loại pixel đơn thuần SẼ THẤT BẠI

**Giải pháp: Spectral Unmixing**

```yaml
Endmembers:
  - flower_red: High anthocyanin
  - flower_white: Low pigments
  - flower_yellow: High carotenoid
  - green_vegetation: High chlorophyll
  - bare_soil
  - shadow

Method: Linear Spectral Mixture Analysis
→ Ước tính tỷ lệ % hoa trong mỗi pixel
```

---

## 🤖 KIẾN TRÚC MÔ HÌNH TIÊN TIẾN

### So sánh Các Mô hình

| Model | Type | Ưu điểm | Nhược điểm | Phù hợp |
|-------|------|---------|------------|---------|
| **Random Forest** | Shallow | Nhanh, ít data | Không có context không gian/thời gian | ✅ Baseline |
| **SVM** | Shallow | Ranh giới tối ưu | Không có context | ✅ Baseline |
| **LSTM** | Deep Temporal | Xử lý chuỗi thời gian, cloud gaps | Không có context không gian | ✅ Phenology |
| **GRU** | Deep Temporal | Nhanh hơn LSTM | Giống LSTM | ✅ Efficient |
| **CNN-2D** | Deep Spatial | Trích xuất đặc trưng không gian | Không có context thời gian | ⚠️ Single image |
| **CNN-3D** | Deep Spatial-Spectral | Học đồng thời không gian + quang phổ | Không xử lý thời gian | ⚠️ Hyperspectral cube |
| **CNN-LSTM** | **Hybrid** | **Kết hợp không gian + thời gian** | Phức tạp, cần nhiều data | ⭐ **RECOMMENDED** |
| **3D-CNN-LSTM** | **Hybrid** | **Không gian + Quang phổ + Thời gian** | Rất phức tạp | ⭐⭐ **OPTIMAL** |
| **Attention-LSTM** | Hybrid | Tập trung vào peak bloom | Phức tạp | ✅ Peak detection |
| **Transformer** | State-of-art | Global context | Cần RẤT NHIỀU data | 🔬 Research |

---

### Kiến trúc Đề xuất: **3D-CNN-LSTM**

```
INPUT: Time series of hyperspectral cubes
  ↓
[Time Step 1: Cube (x, y, λ)] → 3D-CNN → Feature Vector 1
[Time Step 2: Cube (x, y, λ)] → 3D-CNN → Feature Vector 2
[Time Step 3: Cube (x, y, λ)] → 3D-CNN → Feature Vector 3
  ...
[Time Step N: Cube (x, y, λ)] → 3D-CNN → Feature Vector N
  ↓
Sequence of Feature Vectors → LSTM → Phenology Curve
  ↓
OUTPUT: Bloom probability at target date
```

**Tại sao tối ưu?**
1. **3D-CNN**: Học đặc trưng không gian-quang phổ (hoa trông như thế nào)
2. **LSTM**: Mô hình hóa tiến triển thời gian (hoa thay đổi như thế nào)
3. Xử lý cloud gaps tự nhiên
4. Có thể dự báo future dates

**Cấu hình**:
```yaml
cnn3d_lstm:
  cnn_stage:
    filters: [32, 64, 128]
    kernel_size: [3, 3, 3]
    pool_size: [2, 2, 1]  # Không pool trong chiều quang phổ
  lstm_stage:
    hidden_size: 128
    num_layers: 2
    bidirectional: true
  dropout: 0.3
```

---

## 📊 ENVIRONMENTAL PRIORS (Quan trọng!)

### Tại sao cần Environmental Priors?

**Vấn đề**: 
- Hoa Đỗ quyên và Hoa Mận có thể có quang phổ tương tự (cả 2 đều có anthocyanin)
- Nở ở thời gian khác nhau (Mận: Tháng 1-2, Đỗ quyên: Tháng 3-5)
- Nhưng nếu dự báo cùng 1 ngày (ví dụ tháng 4), làm sao phân biệt?

**Giải pháp**: Sử dụng ràng buộc không gian-sinh thái

```python
# Rhododendron Prior
if (elevation > 1500m) and (slope > 10°) and (land_cover == "forest"):
    → Có thể là Đỗ quyên
    → Dùng indices: BLUE_RATIO, ARI, CRI
    
# Prunus Prior  
if (elevation < 1300m) and (slope < 20°) and (land_cover == "orchard"):
    → Có thể là Mận
    → Dùng indices: ARI2, PSRI
```

**Implementation**:
```python
# Thêm vào feature vector
features = [
    spectral_indices,  # ARI, CRI, NDVI, etc.
    elevation,
    slope,
    aspect,
    land_cover_onehot,
    soil_ph  # (nếu có)
]

# Model sẽ học:
# "Pixel với ARI cao + elevation > 2000m + forest → Rhododendron"
# "Pixel với ARI cao + elevation ~1000m + orchard → Prunus"
```

---

## 🚀 HƯỚNG DẪN SỬ DỤNG

### Method 1: Interactive Batch Script (Đơn giản nhất)

```powershell
.\predict_flowers.bat
```

**Menu**:
```
1. Tam Giac Mach (Ha Giang) - October-December
2. Hoa Man (Moc Chau) - Late January-February
3. Hoa Do Quyen (Hoang Lien Son) - March-May
4. Hoa Do Quyen (Lao Cai) - March-June
5. ALL - Chay tat ca loai

Nhap lua chon (1/2/3/4/5): 3
Nhap ngay du bao (YYYY-MM-DD): 2025-04-15
```

→ Tự động chạy và mở HTML map

---

### Method 2: Direct Command Line

#### Tam Giác Mạch (Mùa Thu)
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py `
  --aoi Ha_Giang_TamGiacMach `
  --date 2025-11-01 `
  --models random_forest lstm gru `
  --threshold 0.5
```

#### Hoa Mận (Mùa Xuân - ngắn!)
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py `
  --aoi Moc_Chau_Prunus `
  --date 2026-02-05 `
  --models random_forest lstm cnn_lstm `
  --threshold 0.7
```
⚠️ **Lưu ý**: Threshold cao (0.7) vì peak bloom rất ngắn

#### Hoa Đỗ Quyên Fansipan (Mùa Xuân)
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py `
  --aoi Hoang_Lien_Rhododendron `
  --date 2025-04-20 `
  --models random_forest lstm cnn3d_lstm `
  --threshold 0.6
```
⭐ **Khuyến nghị**: Dùng `cnn3d_lstm` để tận dụng spatial-spectral features

#### Hoa Đỗ Quyên Lào Cai (Mùa Xuân-Hè)
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py `
  --aoi Lao_Cai_Rhododendron `
  --date 2025-05-01 `
  --models random_forest lstm cnn3d_lstm `
  --threshold 0.6
```

---

### Method 3: Batch Forecasting (Multi-dates)

Tạo file `forecast_4_species.py`:

```python
import subprocess
import webbrowser
from datetime import datetime, timedelta

PYTHON = r"C:\Users\Admin\anaconda3\envs\plantgpu\python.exe"

# Define species with optimal dates
SPECIES = {
    "Tam_Giac_Mach": {
        "aoi": "Ha_Giang_TamGiacMach",
        "optimal_dates": ["2025-10-25", "2025-11-05", "2025-11-15"],
        "models": ["random_forest", "lstm"],
        "threshold": 0.5
    },
    "Hoa_Man": {
        "aoi": "Moc_Chau_Prunus",
        "optimal_dates": ["2026-01-28", "2026-02-03", "2026-02-10"],
        "models": ["random_forest", "lstm", "cnn_lstm"],
        "threshold": 0.7
    },
    "Do_Quyen_Fansipan": {
        "aoi": "Hoang_Lien_Rhododendron",
        "optimal_dates": ["2025-04-05", "2025-04-15", "2025-04-25"],
        "models": ["random_forest", "lstm", "cnn3d_lstm"],
        "threshold": 0.6
    },
    "Do_Quyen_Lao_Cai": {
        "aoi": "Lao_Cai_Rhododendron",
        "optimal_dates": ["2025-04-10", "2025-04-20", "2025-05-01"],
        "models": ["random_forest", "lstm", "cnn3d_lstm"],
        "threshold": 0.6
    }
}

def forecast_species(species_name, config):
    print(f"\n{'='*60}")
    print(f"🌸 FORECASTING: {species_name}")
    print(f"{'='*60}")
    
    for date in config["optimal_dates"]:
        print(f"\n📅 Date: {date}")
        
        cmd = [
            PYTHON, "main.py",
            "--aoi", config["aoi"],
            "--date", date,
            "--models", *config["models"],
            "--threshold", str(config["threshold"])
        ]
        
        subprocess.run(cmd)
    
    # Open visualization
    html_path = f"outputs/visualizations/{config['aoi']}/{config['aoi']}_hotspots_map.html"
    webbrowser.open(html_path)

# Run for all species
for species, config in SPECIES.items():
    forecast_species(species, config)
```

Chạy:
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe forecast_4_species.py
```

---

## 🔬 PHƯƠNG PHÁP PHÂN TÍCH

### 1. Time Series Analysis với LSTM

**Input**: Chuỗi thời gian các chỉ số
```
Date        | ARI  | CRI  | NDVI | BLUE_RATIO
------------|------|------|------|------------
2025-03-01  | 0.12 | 0.08 | 0.75 | 0.85
2025-03-06  | 0.15 | 0.09 | 0.73 | 0.82
2025-03-11  | 0.25 | 0.18 | 0.68 | 0.75  ← Bloom starting
2025-03-16  | 0.45 | 0.32 | 0.60 | 0.65  ← Peak
2025-03-21  | 0.38 | 0.28 | 0.65 | 0.70
```

**LSTM Output**: Phenology curve
```python
# Predict next 30 days
future_dates = [target_date + timedelta(days=i) for i in range(30)]
predicted_bloom_prob = lstm_model.predict(sequence)

# Detect peak
peak_date = future_dates[np.argmax(predicted_bloom_prob)]
peak_probability = np.max(predicted_bloom_prob)
```

---

### 2. Spatial Analysis với Environmental Priors

```python
# Step 1: Load DEM and create spatial features
import rasterio
from scipy.ndimage import sobel

dem = rasterio.open("dem.tif").read(1)
slope = np.degrees(np.arctan(np.sqrt(sobel(dem, axis=0)**2 + sobel(dem, axis=1)**2)))
aspect = np.degrees(np.arctan2(sobel(dem, axis=1), sobel(dem, axis=0)))

# Step 2: Create masks
rhododendron_mask = (
    (dem > 1500) & 
    (slope > 10) & 
    (slope < 60) &
    ((aspect < 90) | (aspect > 270))  # North or East
)

prunus_mask = (
    (dem > 800) & 
    (dem < 1300) &
    (slope < 20)
)

# Step 3: Apply masks to predictions
rhododendron_predictions = predictions * rhododendron_mask
prunus_predictions = predictions * prunus_mask
```

---

### 3. Spectral Unmixing

```python
from sklearn.decomposition import NMF

# Define endmembers (từ field spectroscopy hoặc pure pixels)
endmembers = np.array([
    [0.05, 0.08, 0.65, 0.12, 0.15, 0.45, 0.85, 0.90],  # flower_red
    [0.06, 0.10, 0.75, 0.15, 0.18, 0.50, 0.88, 0.92],  # flower_white
    [0.07, 0.15, 0.80, 0.20, 0.22, 0.55, 0.82, 0.88],  # flower_yellow
    [0.04, 0.05, 0.12, 0.08, 0.55, 0.25, 0.95, 0.96],  # green_vegetation
    [0.15, 0.18, 0.22, 0.25, 0.28, 0.32, 0.40, 0.42],  # bare_soil
    [0.02, 0.02, 0.03, 0.03, 0.04, 0.05, 0.08, 0.09],  # shadow
])

# Unmix pixels
nmf = NMF(n_components=6, init='custom', solver='mu', max_iter=1000)
nmf.components_ = endmembers
fractions = nmf.fit_transform(pixel_spectra)

# Calculate flower fraction
flower_fraction = fractions[:, 0] + fractions[:, 1] + fractions[:, 2]
bloom_probability = flower_fraction / (1.0 + 1e-6)  # Normalize
```

---

## 📈 CASE STUDIES

### Case 1: Dự báo Đỗ Quyên Fansipan (Tháng 4/2025)

**Yêu cầu**: Tìm thời điểm đẹp nhất để lên Fansipan xem hoa

**Workflow**:
```powershell
# 1. Forecast 3 dates in April
.\predict_flowers.bat
# Chọn 3 → Fansipan
# Nhập: 2025-04-05

.\predict_flowers.bat
# Chọn 3
# Nhập: 2025-04-15

.\predict_flowers.bat
# Chọn 3
# Nhập: 2025-04-25

# 2. Compare results
Import-Csv "outputs\hotspots\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots.csv" `
  | Sort-Object bloom_probability -Descending | Select-Object -First 10
```

**Kết quả mong đợi**:
```
Date       | Max Prob | Location          | Notes
-----------|----------|-------------------|-------------------
2025-04-05 | 45%      | (103.82, 22.30)   | Bloom starting
2025-04-15 | 85%      | (103.88, 22.32)   | PEAK - GO NOW!
2025-04-25 | 62%      | (103.85, 22.28)   | Still good
```

---

### Case 2: So sánh 2 vùng Đỗ Quyên (Fansipan vs Putaleng)

**Yêu cầu**: Vùng nào nở sớm hơn?

```python
# forecast_comparison.py
dates = ["2025-04-01", "2025-04-10", "2025-04-20"]
areas = ["Hoang_Lien_Rhododendron", "Lao_Cai_Rhododendron"]

results = {}
for date in dates:
    for area in areas:
        cmd = [PYTHON, "main.py", "--aoi", area, "--date", date, 
               "--models", "random_forest", "lstm", "--threshold", "0.6"]
        subprocess.run(cmd)
        
        # Read summary
        summary_path = f"outputs/hotspots/{area}/{area}_summary.json"
        with open(summary_path) as f:
            results[f"{area}_{date}"] = json.load(f)

# Compare
for date in dates:
    print(f"\n📅 {date}")
    print(f"  Fansipan: {results[f'Hoang_Lien_Rhododendron_{date}']['max_probability']:.2%}")
    print(f"  Putaleng:  {results[f'Lao_Cai_Rhododendron_{date}']['max_probability']:.2%}")
```

---

### Case 3: Phát hiện Mixed Pixels (Hoa Mận)

**Vấn đề**: Vườn mận có nhiều cành trắng + lá xanh → mixed pixels

**Workflow**:
```python
# 1. Run basic prediction
subprocess.run([
    PYTHON, "main.py",
    "--aoi", "Moc_Chau_Prunus",
    "--date", "2026-02-05",
    "--models", "random_forest", "cnn_lstm"
])

# 2. Apply spectral unmixing
from src.analysis.unmixing import SpectralUnmixing

unmixer = SpectralUnmixing(
    endmembers=["flower_white", "green_vegetation", "shadow", "bare_soil"]
)

fractions = unmixer.fit_transform(pixel_spectra)

# 3. Refine bloom probability
refined_prob = fractions["flower_white"] * 0.8 + \
               fractions["green_vegetation"] * 0.2  # Some green is normal

# 4. Re-detect hotspots
hotspots = refined_prob > 0.7
```

---

## ⚙️ TUNING PARAMETERS

### Threshold theo Loài

| Species | Threshold | Lý do |
|---------|-----------|-------|
| Tam Giác Mạch | 0.5 | Bloom dài, dễ phát hiện |
| Hoa Mận | 0.7-0.8 | Peak ngắn, cần chính xác cao |
| Đỗ Quyên | 0.6 | Địa hình hiểm, cần balance |

### Model Selection

| Task | Recommended Model | Rationale |
|------|-------------------|-----------|
| Quick baseline | Random Forest | Fast, robust |
| Temporal patterns | LSTM, GRU | Handle time series |
| Spatial context | CNN-LSTM | Image + time |
| Full hyperspectral | 3D-CNN-LSTM | Spectral + spatial + time |
| Peak detection | Attention-LSTM | Focus on critical dates |

---

## 🐛 TROUBLESHOOTING

### Lỗi: "No hotspots detected"

**Nguyên nhân**:
1. Threshold quá cao
2. Ngày dự báo ngoài bloom window
3. Cloud cover quá nhiều

**Giải pháp**:
```powershell
# Giảm threshold
--threshold 0.3

# Kiểm tra bloom window
# Tam Giác Mạch: 9/25 - 12/20
# Hoa Mận: 1/20 - 2/28
# Đỗ Quyên: 3/1 - 5/31
```

---

### Lỗi: Gi* calculation failed

**Nguyên nhân**: Too many isolated points

**Giải pháp**:
```yaml
# config.yaml
spatial_analysis:
  gi_star:
    distance_band: 2000  # Tăng từ 1000m → 2000m
```

---

### Lỗi: DBSCAN found 0 clusters

**Nguyên nhân**: Points too scattered in mountain terrain

**Giải pháp**:
```yaml
# config.yaml
spatial_analysis:
  dbscan:
    eps: 300  # Giảm từ 500m → 300m
    min_samples: 3  # Giảm từ 5 → 3
```

---

## 📚 REFERENCES

1. **Anthocyanin/Carotenoid Indices**: 
   - Gitelson et al. (2001) - ARI development
   - Blackburn (1998) - PRI and carotenoid estimation

2. **Rhododendron Spectroscopy**:
   - Hill et al. (2010) - 450nm blue band for Rhododendron detection
   - Custom R331/R581, R331/R631 ratios (R²=0.67-0.68)

3. **Phenology Modeling**:
   - Zhang et al. (2003) - TIMESAT phenology extraction
   - Bolton et al. (2020) - Deep learning for crop phenology

4. **Spectral Unmixing**:
   - Adams et al. (1986) - Linear spectral mixture analysis
   - Somers et al. (2011) - Automated endmember extraction

5. **Deep Learning Architectures**:
   - Rußwurm & Körner (2018) - LSTM for time series classification
   - Ndikumana et al. (2018) - CNN-LSTM for crop mapping
   - Roy et al. (2021) - 3D-CNN for hyperspectral classification

---

## 📞 SUPPORT

Gặp vấn đề? Kiểm tra:
1. `USAGE_GUIDE.md` - Hướng dẫn cơ bản
2. `GUIDE_3_SPECIES.md` - Hướng dẫn 3 loài (cũ)
3. `RESULTS_SUMMARY.md` - Kết quả ví dụ
4. `QUICK_COMMANDS.md` - Lệnh nhanh

---

**Updated**: October 2025  
**Version**: 2.0 - Scientific Enhancement  
**Author**: Hyperspectral Bloom Forecasting Team

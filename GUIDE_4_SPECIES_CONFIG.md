# 🌺 TÓM TẮT CẤU HÌNH 4 LOÀI HOA

## 📊 BẢNG SO SÁNH 4 LOÀI

| Đặc điểm | Tam Giác Mạch | Hoa Mận | Đỗ Quyên (Fansipan) | Đỗ Quyên (Lào Cai) |
|----------|---------------|---------|---------------------|-------------------|
| **Tên khoa học** | *Fagopyrum esculentum* | *Prunus mume* | *Rhododendron spp.* | *Rhododendron spp.* |
| **Vùng** | Hà Giang | Mộc Châu | Hoàng Liên Sơn | Putaleng |
| **Tọa độ** | 104.95°-105.45°E<br>23.05°-23.27°N | 104.45°-104.85°E<br>20.72°-21.00°N | 103.73°-103.95°E<br>22.25°-22.42°N | 103.82°-104.05°E<br>22.18°-22.35°N |
| **Độ cao** | 800-1500m | 1000-1100m | **1500-3200m** | **2000-3400m** |
| **Thời gian nở** | Tháng 10-12 | **Tháng 1-2** | Tháng 3-5 | Tháng 3-6 |
| **Peak bloom** | Tháng 11 | **7-10 ngày!** | Tháng 4 | Tháng 4 |
| **Thời gian nở rộ** | ~60 ngày | **7-10 ngày** | ~90 ngày | ~90 ngày |
| **Loại hình** | Nông nghiệp | Vườn cây | **Rừng tự nhiên** | **Rừng tự nhiên** |
| **Độ dốc** | 0-30° | 0-20° | **10-60°** | **10-60°** |
| **pH đất** | N/A | N/A | **4.2-6.0 (chua)** | **4.2-6.0 (chua)** |
| **Ánh sáng** | Full sun | Full sun | **Shade-tolerant** | **Shade-tolerant** |

---

## 🔬 CHỈ SỐ QUANG PHỔ THEO LOÀI

### TAM GIÁC MẠCH
```yaml
Primary Indices:
  - NYI: Normalized Yellowing Index
  - ARI: Anthocyanin (màu hồng nhạt)
  - NDVI: Vegetation health
  
Models: Random Forest, LSTM, GRU
Threshold: 0.5
```

### HOA MẬN
```yaml
Primary Indices:
  - ARI2: Anthocyanin Index 2 (hoa trắng/hồng)
  - SR_ANTHO: R331/R581 custom ratio
  - PSRI: Carotenoid/Chlorophyll ratio
  
Models: Random Forest, LSTM, CNN-LSTM
Threshold: 0.7-0.8 (vì peak ngắn!)
Challenges:
  - ⚠️ Peak bloom chỉ 7-10 ngày
  - ⚠️ Sentinel-2 5-day repeat có thể miss
  - ⚠️ Cần LSTM để nội suy
```

### HOA ĐỖ QUYÊN (CẢ 2 VÙNG)
```yaml
Primary Indices:
  - BLUE_RATIO: B02/B04 (450nm - 80% accuracy!)
  - ARI1, ARI2: Anthocyanin detection
  - CRI1, CRI2: Carotenoid detection
  - SR_ANTHO: B01/B03 custom
  - SR_CARO: B01/B04 custom
  
Models: Random Forest, LSTM, 3D-CNN-LSTM (OPTIMAL)
Threshold: 0.6
Environmental Priors:
  - Elevation > 1500m
  - Slope: 10-60°
  - Land cover: Forest
  - Aspect: North/East (shade)
```

---

## 🎯 RECOMMENDED MODELS THEO LOÀI

| Species | Baseline | Standard | Advanced | Research |
|---------|----------|----------|----------|----------|
| **Tam Giác Mạch** | RF | LSTM | GRU | Transformer |
| **Hoa Mận** | RF | LSTM | **CNN-LSTM** | Attention-LSTM |
| **Đỗ Quyên** | RF | LSTM | **3D-CNN-LSTM** | Transformer |

**Giải thích**:
- **RF**: Quick baseline, 2 phút
- **LSTM**: Temporal patterns, 8 phút
- **CNN-LSTM**: Spatial + temporal, 15 phút
- **3D-CNN-LSTM**: Hyperspectral + spatial + temporal, 25 phút (BEST for Rhododendron)

---

## 📅 BLOOM CALENDAR

```
Jan  | ████ Hoa Mận (peak 7-10 days)
Feb  | ████
Mar  | ░░░░░░░░ Đỗ Quyên (starting)
Apr  | ████████ Đỗ Quyên (PEAK both areas)
May  | ████░░░░ Đỗ Quyên (still good)
Jun  | ░░░░ Đỗ Quyên Lào Cai (ending)
...
Oct  | ░░░░ Tam Giác Mạch (starting)
Nov  | ████████ Tam Giác Mạch (PEAK)
Dec  | ████░░░░ Tam Giác Mạch (ending)
```

---

## 🚀 QUICK START COMMANDS

### Tam Giác Mạch (November 2025)
```powershell
.\run_predict.bat 2025-11-15
```

### Hoa Mận (February 2026)
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py ^
  --aoi Moc_Chau_Prunus ^
  --date 2026-02-05 ^
  --models random_forest lstm cnn_lstm ^
  --threshold 0.7
```

### Đỗ Quyên Fansipan (April 2025)
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py ^
  --aoi Hoang_Lien_Rhododendron ^
  --date 2025-04-15 ^
  --models random_forest lstm cnn3d_lstm ^
  --threshold 0.6
```

### Đỗ Quyên Lào Cai (May 2025)
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py ^
  --aoi Lao_Cai_Rhododendron ^
  --date 2025-05-01 ^
  --models random_forest lstm cnn3d_lstm ^
  --threshold 0.6
```

### TẤT CẢ 4 LOÀI (Same date comparison)
```powershell
.\predict_flowers.bat
# Chọn: 5 (ALL)
# Nhập ngày: 2025-04-15
```

---

## 📈 OUTPUT STRUCTURE

```
outputs/
├── Ha_Giang_TamGiacMach/
│   ├── timeseries/
│   ├── models/
│   ├── hotspots/
│   │   ├── Ha_Giang_TamGiacMach_hotspots.csv
│   │   ├── Ha_Giang_TamGiacMach_summary.json
│   │   └── Ha_Giang_TamGiacMach_hotspots.geojson
│   └── visualizations/
│       └── Ha_Giang_TamGiacMach_hotspots_map.html
│
├── Moc_Chau_Prunus/
│   └── (same structure)
│
├── Hoang_Lien_Rhododendron/
│   └── (same structure)
│
└── Lao_Cai_Rhododendron/
    └── (same structure)
```

---

## 🔧 TUNING GUIDE

### Threshold Adjustment

**Khi nào giảm threshold?**
- Không tìm thấy hotspots
- Muốn xem bloom potential (không chỉ peak)
- Đang ở đầu/cuối mùa hoa

```powershell
--threshold 0.3  # Very permissive
--threshold 0.5  # Balanced (default Tam Giác Mạch)
--threshold 0.7  # Strict (default Hoa Mận)
--threshold 0.8  # Very strict (peak only)
```

**Khi nào tăng threshold?**
- Quá nhiều false positives
- Chỉ muốn xem peak bloom
- Hoa Mận (vì peak ngắn)

---

### Model Selection

**Scenario 1: Quick test (5 phút)**
```powershell
--models random_forest
```

**Scenario 2: Standard forecast (10 phút)**
```powershell
--models random_forest lstm
```

**Scenario 3: High accuracy (15-20 phút)**
```powershell
# For Tam Giác Mạch, Hoa Mận:
--models random_forest lstm gru

# For Đỗ Quyên:
--models random_forest lstm cnn_lstm
```

**Scenario 4: Research-grade (25-30 phút)**
```powershell
# For Đỗ Quyên only:
--models random_forest lstm cnn3d_lstm
```

---

## 🌐 SPATIAL ANALYSIS TUNING

### Hotspot Detection (Getis-Ord Gi*)

**Nếu lỗi**: "Gi* calculation failed"

```yaml
# config.yaml
spatial_analysis:
  gi_star:
    distance_band: 2000  # Tăng lên cho vùng núi
```

### Clustering (DBSCAN)

**Nếu**: 0 clusters found

```yaml
# config.yaml
spatial_analysis:
  dbscan:
    eps: 300  # Giảm xuống cho địa hình hiểm trở
    min_samples: 3  # Giảm xuống cho ít điểm hơn
```

---

## 🎓 USE CASES

### Case 1: Tourism Planning
**Câu hỏi**: "Tuần nào trong tháng 4 đi Fansipan đẹp nhất?"

```powershell
# Test 4 tuần
.\predict_flowers.bat
# Date: 2025-04-01

.\predict_flowers.bat
# Date: 2025-04-08

.\predict_flowers.bat
# Date: 2025-04-15

.\predict_flowers.bat
# Date: 2025-04-22

# Compare max_probability in summary.json files
```

---

### Case 2: Scientific Research
**Câu hỏi**: "Đỗ quyên Fansipan vs Putaleng nở khác biệt như thế nào?"

```python
# compare_areas.py
import json
import matplotlib.pyplot as plt

dates = ["2025-04-01", "2025-04-10", "2025-04-20", "2025-05-01"]
areas = ["Hoang_Lien", "Lao_Cai"]

data = {area: [] for area in areas}

for date in dates:
    for area in areas:
        path = f"outputs/hotspots/{area}_Rhododendron/{area}_Rhododendron_summary.json"
        with open(path) as f:
            data[area].append(json.load(f)["max_probability"])

# Plot comparison
plt.plot(dates, data["Hoang_Lien"], label="Fansipan", marker='o')
plt.plot(dates, data["Lao_Cai"], label="Putaleng", marker='s')
plt.xlabel("Date")
plt.ylabel("Max Bloom Probability")
plt.title("Rhododendron Bloom Comparison")
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("rhododendron_comparison.png")
```

---

### Case 3: Weekly Monitoring
**Câu hỏi**: "Tôi muốn theo dõi hàng tuần trong cả mùa hoa"

```powershell
# Tạo scheduled task (Windows Task Scheduler)
# Run every Sunday at 6 AM:

schtasks /create /tn "Bloom_Weekly_Forecast" /tr "d:\Hyperspectral_ROI\run_predict.bat" /sc weekly /d SUN /st 06:00
```

---

## 📚 FILE GUIDE

| File | Purpose |
|------|---------|
| `config.yaml` | **Core configuration** - 4 AOIs, indices, models |
| `predict_flowers.bat` | **Interactive menu** - 5 choices |
| `run_predict.bat` | **Quick run** - Tam Giác Mạch only |
| `GUIDE_4_SPECIES_SCIENTIFIC.md` | **Full scientific guide** - 200+ lines |
| `GUIDE_4_SPECIES_CONFIG.md` | **This file** - Quick reference |
| `QUICK_COMMANDS.md` | **Cheat sheet** - All commands |
| `USAGE_GUIDE.md` | **Basic usage** - Getting started |

---

## 🔍 TROUBLESHOOTING QUICK FIX

| Problem | Quick Fix |
|---------|-----------|
| No hotspots found | `--threshold 0.3` |
| Gi* calculation failed | Edit config: `distance_band: 2000` |
| 0 clusters | Edit config: `eps: 300, min_samples: 3` |
| Too slow | `--models random_forest` only |
| Out of memory | Reduce grid size in code |
| Cloud masking issues | Check date range, avoid rainy season |

---

## 📞 NEXT STEPS

1. **Test system**: Chạy 1 loài để verify
   ```powershell
   .\predict_flowers.bat  # Choose option 1
   ```

2. **Review outputs**: Kiểm tra HTML maps và CSV

3. **Tune parameters**: Adjust threshold, models theo kết quả

4. **Scale up**: Chạy tất cả 4 loài hoặc multiple dates

5. **Advanced analysis**: Implement unmixing, environmental priors

---

**Updated**: October 2025  
**Version**: 2.0  
**Quick Reference Guide**

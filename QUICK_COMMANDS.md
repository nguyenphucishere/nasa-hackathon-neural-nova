# ⚡ LỆNH NHANH - 4 LOÀI HOA TÂY BẮC

## 🌸 TAM GIÁC MẠCH (Hà Giang)
**Bloom**: October-December | **Peak**: November

### Ngày hôm nay
```powershell
.\run_predict.bat
```

### Ngày cụ thể (ví dụ: 15/11/2025)
```powershell
.\run_predict.bat 2025-11-15
```

### Lệnh đầy đủ
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Ha_Giang_TamGiacMach --date 2025-11-15 --models random_forest lstm gru --threshold 0.5
```

### Xem kết quả
```powershell
Start-Process "outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html"
```

---

## 🌸 HOA MẬN (Mộc Châu)
**Bloom**: Late Jan-Feb | **Peak**: 7-10 days only!

### Ngày cụ thể (ví dụ: 5/2/2026)
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Moc_Chau_Prunus --date 2026-02-05 --models random_forest lstm cnn_lstm --threshold 0.7
```
⚠️ **Lưu ý**: Threshold cao (0.7) vì peak bloom cực kỳ ngắn!

### Xem kết quả
```powershell
Start-Process "outputs\visualizations\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_map.html"
```

---

## 🌸 HOA ĐỖ QUYÊN - FANSIPAN (Hoàng Liên Sơn)
**Bloom**: March-May | **Peak**: April | **Elevation**: 1500-3200m

### Ngày cụ thể (ví dụ: 15/4/2025)
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Hoang_Lien_Rhododendron --date 2025-04-15 --models random_forest lstm cnn3d_lstm --threshold 0.6
```
⭐ **Khuyến nghị**: Dùng `cnn3d_lstm` cho accuracy cao nhất!

### Xem kết quả
```powershell
Start-Process "outputs\visualizations\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots_map.html"
```

---

## 🌸 HOA ĐỖ QUYÊN - LÀO CAI (Putaleng)
**Bloom**: March-June | **Peak**: April | **Elevation**: 2000-3400m

### Ngày cụ thể (ví dụ: 1/5/2025)
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Lao_Cai_Rhododendron --date 2025-05-01 --models random_forest lstm cnn3d_lstm --threshold 0.6
```

### Xem kết quả
```powershell
Start-Process "outputs\visualizations\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_hotspots_map.html"
```

---

## 🌸 TẤT CẢ 4 LOÀI (Batch)

## 🌸 TẤT CẢ 4 LOÀI (Batch)

### Dùng menu interactive
```powershell
.\predict_flowers.bat
# Chọn: 5 (ALL)
# Nhập ngày hoặc Enter
```

### Dùng Python script
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe forecast_multi.py
# Chọn mode và species theo menu
```

---

## 📊 XEM & SO SÁNH KẾT QUẢ

### Mở tất cả 4 maps
```powershell
Start-Process "outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html"
Start-Process "outputs\visualizations\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_map.html"
Start-Process "outputs\visualizations\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots_map.html"
Start-Process "outputs\visualizations\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_hotspots_map.html"
```

### So sánh CSV - Top 5 hotspots mỗi loài
```powershell
# Tam Giác Mạch
Import-Csv "outputs\hotspots\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots.csv" | Sort-Object bloom_probability -Descending | Select-Object -First 5

# Hoa Mận
Import-Csv "outputs\hotspots\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots.csv" | Sort-Object bloom_probability -Descending | Select-Object -First 5

# Đỗ Quyên Fansipan
Import-Csv "outputs\hotspots\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots.csv" | Sort-Object bloom_probability -Descending | Select-Object -First 5

# Đỗ Quyên Lào Cai
Import-Csv "outputs\hotspots\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_hotspots.csv" | Sort-Object bloom_probability -Descending | Select-Object -First 5
```

### So sánh JSON summary
```powershell
# Xem max probability của mỗi loài
Get-Content "outputs\hotspots\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_summary.json" | ConvertFrom-Json | Select-Object max_probability, mean_probability, significant_hotspots

Get-Content "outputs\hotspots\Moc_Chau_Prunus\Moc_Chau_Prunus_summary.json" | ConvertFrom-Json | Select-Object max_probability, mean_probability, significant_hotspots

Get-Content "outputs\hotspots\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_summary.json" | ConvertFrom-Json | Select-Object max_probability, mean_probability, significant_hotspots

Get-Content "outputs\hotspots\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_summary.json" | ConvertFrom-Json | Select-Object max_probability, mean_probability, significant_hotspots
```

---

## 🎯 USE CASES

### Case 1: "Tháng 4 nên đi Fansipan hay Putaleng?"
```powershell
# Test cả 2 vùng cùng 1 ngày
.\predict_flowers.bat
# Chọn: 3 (Fansipan), Date: 2025-04-15

.\predict_flowers.bat
# Chọn: 4 (Lào Cai), Date: 2025-04-15

# So sánh max_probability trong summary.json
```

### Case 2: "Dự báo ngày 20/6/2020 (quá khứ)"
```powershell
.\run_predict.bat 2020-06-20
```

### Case 3: "Dự báo cả tuần Đỗ quyên (nhiều ngày)"
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe forecast_multi.py
# Mode 2: Date range
# Species: Hoang_Lien_Rhododendron
# From: 2025-04-10
# To: 2025-04-20
```

### Case 4: "So sánh Mận và Đỗ quyên cùng tháng 2"
```powershell
# Mận (peak)
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Moc_Chau_Prunus --date 2026-02-05 --models random_forest lstm --threshold 0.7

# Đỗ quyên (bắt đầu nở)
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Hoang_Lien_Rhododendron --date 2026-02-25 --models random_forest lstm --threshold 0.5
```

---

## 🚀 QUY TRÌNH HOÀN CHỈNH (Từ đầu đến cuối)

```powershell
# 1. Chọn loài và ngày
.\predict_flowers.bat

# 2. Menu hiện:
#    Chon loai hoa:
#      1. Tam Giac Mach (Ha Giang) - October-December
#      2. Hoa Man (Moc Chau) - Late January-February
#      3. Hoa Do Quyen (Hoang Lien Son) - March-May
#      4. Hoa Do Quyen (Lao Cai) - March-June
#      5. ALL - Chay tat ca loai
#    → Nhập: 3

# 3. Nhập ngày:
#    Nhap ngay (YYYY-MM-DD) hoac Enter:
#    → Nhập: 2025-04-15

# 4. Chờ chạy (10-25 phút tùy model)
#    [Output hiện]:
#    📡 STEP 1: DATA COLLECTION
#    🔧 STEP 2: FEATURE ENGINEERING
#    🎯 STEP 3: MODEL TRAINING
#    🗺️  STEP 4: SPATIAL PREDICTION
#    🔥 STEP 5: HOTSPOT DETECTION
#    📊 STEP 6: VISUALIZATION
#    💾 STEP 7: EXPORT

# 5. Tự động mở HTML map trong browser
#    → Xem heatmap và hotspots

# 6. Kiểm tra CSV để có tọa độ chính xác
#    outputs\hotspots\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots.csv
```

---

## 📁 CẤU TRÚC OUTPUT

```
outputs/
├── Ha_Giang_TamGiacMach/
│   ├── timeseries/        # Time series data
│   ├── models/            # Trained models
│   ├── hotspots/
│   │   ├── *_hotspots.csv      ← TOP hotspots với tọa độ
│   │   ├── *_summary.json      ← Statistics summary
│   │   └── *_hotspots.geojson  ← GIS data
│   └── visualizations/
│       └── *_hotspots_map.html ← BẢN ĐỒ CHÍNH
│
├── Moc_Chau_Prunus/
│   └── (cấu trúc tương tự)
│
├── Hoang_Lien_Rhododendron/
│   └── (cấu trúc tương tự)
│
└── Lao_Cai_Rhododendron/
    └── (cấu trúc tương tự)
```

---

## ⏱️ THỜI GIAN CHẠY

- **Random Forest only**: ~2 phút
- **RF + LSTM**: ~10 phút (có GPU)
- **RF + LSTM + CNN-LSTM**: ~18 phút (có GPU)
- **RF + LSTM + 3D-CNN-LSTM**: ~25 phút (có GPU, tốt nhất cho Đỗ quyên)
- **Cả 4 loài (RF only)**: ~10 phút
- **Cả 4 loài (RF + LSTM)**: ~40 phút

---

## 🔧 TUNING PARAMETERS

### Threshold theo loài

```powershell
# Tam Giác Mạch - Bloom dài, dễ phát hiện
--threshold 0.5

# Hoa Mận - Peak ngắn, cần chính xác cao
--threshold 0.7  # hoặc 0.8 cho peak only

# Đỗ Quyên - Địa hình hiểm, balance
--threshold 0.6

# Tất cả - Permissive
--threshold 0.3
```

### Model selection theo loài

```powershell
# Tam Giác Mạch
--models random_forest lstm gru

# Hoa Mận (cần temporal precision)
--models random_forest lstm cnn_lstm

# Đỗ Quyên (cần spatial-spectral-temporal)
--models random_forest lstm cnn3d_lstm
```

---

## 📊 BLOOM CALENDAR

```
        J   F   M   A   M   J   J   A   S   O   N   D
Mận     ██████                                      
Đỗ Quyên    ░░  ████████  ░░
Tam GM                              ░░  ████████  ░░

Legend:
██ = Peak bloom (highest probability)
░░ = Early/late bloom (moderate probability)
```

**Best dates**:
- Hoa Mận: Feb 1-10
- Đỗ Quyên: Apr 10-25
- Tam Giác Mạch: Nov 1-20

---

## 🎓 HỌC THÊM

### Hướng dẫn chi tiết
```powershell
code GUIDE_4_SPECIES_SCIENTIFIC.md   # Cơ sở khoa học, 200+ dòng
code GUIDE_4_SPECIES_CONFIG.md       # Cấu hình nhanh
code USAGE_GUIDE.md                  # Hướng dẫn cơ bản
code RESULTS_SUMMARY.md              # Kết quả ví dụ
```

### Indices Documentation
```yaml
# Xem config.yaml để hiểu từng chỉ số
Anthocyanin: ARI, ARI2, SR_ANTHO
Carotenoid: CRI, CRI2, PSRI, SR_CARO
Vegetation: NDVI, EVI, SAVI, NDRE, IRECI
Special: BLUE_RATIO (Rhododendron-specific)
```

---

## 🐛 TROUBLESHOOTING

| Problem | Quick Fix |
|---------|-----------|
| No hotspots | `--threshold 0.3` |
| Gi* failed | Edit config: `distance_band: 2000` |
| 0 clusters | Edit config: `eps: 300, min_samples: 3` |
| Too slow | `--models random_forest` only |
| Wrong bloom window | Check date vs species bloom calendar |

---

## 📞 SUPPORT FILES

- **GUIDE_4_SPECIES_SCIENTIFIC.md**: Full scientific basis
- **GUIDE_4_SPECIES_CONFIG.md**: Configuration reference
- **config.yaml**: 4 AOIs, 12+ indices, 13+ models
- **predict_flowers.bat**: Interactive menu
```

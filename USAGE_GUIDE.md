# 🌸 Hệ thống Dự đoán Nở Hoa (Bloom Forecasting System)

## 🎯 Chức năng chính

Dự đoán **xác suất nở hoa** tại bất kỳ ngày nào (quá khứ hoặc tương lai) cho khu vực Hà Giang, Việt Nam.

### Input: 
- **Ngày dự đoán**: Ví dụ 20/6/2020, 15/11/2025, hoặc ngày hiện tại

### Output:
1. **Bản đồ heatmap** toàn khu vực với gradient xác suất bloom (0-100%)
2. **List hotspots** với xác suất >80% kèm tọa độ chính xác
3. **Interactive map** - click bất kỳ điểm nào để xem xác suất

---

## 🚀 Cách sử dụng

### 1. Dự đoán cho NGÀY CỤ THỂ

```powershell
# Dự đoán cho ngày 20/6/2020
.\run_predict.bat 2020-06-20

# Dự đoán cho ngày 15/11/2025 (tương lai)
.\run_predict.bat 2025-11-15
```

### 2. Dự đoán cho NGÀY HIỆN TẠI

```powershell
.\run_predict.bat
```

---

## 📊 Kết quả

Sau khi chạy xong (5-10 phút), kiểm tra:

### 1. **Bản đồ Interactive**
```
outputs/visualizations/Ha_Giang_TamGiacMach/Ha_Giang_TamGiacMach_hotspots_map.html
```
- Mở file HTML trong trình duyệt
- Heatmap gradient màu: Xanh (thấp) → Vàng → Đỏ (cao)
- Click vào bất kỳ điểm nào để xem xác suất chính xác
- Các hotspots >80% được đánh dấu rõ

### 2. **Danh sách Hotspots (CSV)**
```
outputs/hotspots/Ha_Giang_TamGiacMach/Ha_Giang_TamGiacMach_hotspots.csv
```
Chứa:
- Tọa độ (longitude, latitude)
- Xác suất bloom (%)
- Gi* z-score (chỉ số hotspot)
- Cluster ID

### 3. **Dữ liệu GeoJSON**
```
outputs/hotspots/Ha_Giang_TamGiacMach/Ha_Giang_TamGiacMach_hotspots.geojson
```
- Import vào QGIS/ArcGIS để phân tích thêm

---

## 🤖 Models sử dụng

Hệ thống train 3 models và chọn model tốt nhất:

1. **Random Forest** - Nhanh, ổn định
2. **LSTM** - Học được pattern theo thời gian  
3. **GRU** - Tương tự LSTM nhưng nhẹ hơn

---

## 📈 Ví dụ kịch bản sử dụng

### Kịch bản 1: Phân tích lịch sử
```
Câu hỏi: "Ngày 20/6/2020 có những điểm nào bloom cao nhất?"

Chạy: .\run_predict.bat 2020-06-20

Kết quả: 
- Heatmap hiển thị toàn bộ khu vực
- List 15 hotspots với xác suất >80%
- Click vào từng điểm để xem chi tiết
```

### Kịch bản 2: Dự báo tương lai
```
Câu hỏi: "Ngày 15/11/2025 nên đi du lịch ngắm hoa ở đâu?"

Chạy: .\run_predict.bat 2025-11-15

Kết quả:
- Dự đoán xác suất bloom cho toàn khu vực
- Recommend TOP 10 điểm có xác suất cao nhất
```

---

## ⚙️ Tùy chỉnh nâng cao

### Thay đổi threshold hotspot

Mặc định: 50% (để có nhiều hotspots)

Nếu muốn chỉ xem điểm rất chắc chắn bloom:

```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Ha_Giang_TamGiacMach --date 2020-06-20 --threshold 0.8
```

### Chỉ dùng 1 model

```powershell
# Chỉ Random Forest (nhanh nhất)
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Ha_Giang_TamGiacMach --models random_forest

# Chỉ LSTM (chính xác nhất)
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Ha_Giang_TamGiacMach --models lstm
```

---

## 📁 Cấu trúc output

```
outputs/
├── timeseries/          # Dữ liệu time series thu thập từ Sentinel-2
├── models/              # Trained models (có thể tái sử dụng)
├── predictions/         # Raw predictions
├── hotspots/            # Hotspots CSV + GeoJSON
└── visualizations/      # Bản đồ HTML + biểu đồ PNG
    └── Ha_Giang_TamGiacMach/
        ├── *_hotspots_map.html  👈 BẢN ĐỒ CHÍNH
        ├── *_timeseries.png
        └── *_dashboard.html
```

---

## 🔧 Troubleshooting

### Lỗi: "Hotspots = 0"
→ Hạ threshold: `--threshold 0.3`

### Lỗi: Earth Engine timeout
→ Giảm train_years: `--train-years 2`

### Muốn chạy nhanh hơn
→ Chỉ dùng Random Forest: `--models random_forest`

---

## 📞 Hỗ trợ

Nếu cần thêm tính năng:
- Thêm khu vực mới (Mộc Châu, Đà Lạt...)
- Export ảnh PNG thay vì HTML
- Tích hợp API để query từ web app

Chỉnh sửa file `config.yaml` và `main.py`

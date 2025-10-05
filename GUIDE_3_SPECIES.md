# 🌸 HƯỚNG DẪN DỰ BÁO 3 LOÀI HOA

## 📋 Tổng quan

Hệ thống hỗ trợ dự báo nở hoa cho nhiều loài:
1. **Tam Giác Mạch** (Hà Giang) - Tháng 10-12
2. **Hoa Đào/Mận** (Mộc Châu) - Tháng 1-3
3. **Hoa Cải Vàng** (future) - Tháng 2-4

---

## 🚀 CÁCH 1: Dùng Batch Script (Đơn giản nhất)

### A. Chạy interactive menu

```powershell
.\predict_flowers.bat
```

**Menu sẽ hiện**:
```
Chon loai hoa / Select flower species:
  1. Tam Giac Mach (Ha Giang) - October-December
  2. Hoa Dao/Man (Moc Chau) - January-March  
  3. ALL - Chay ca 2 loai

Nhap lua chon (1/2/3): _
```

**Ví dụ sử dụng**:
```
Input: 1
→ Nhap ngay du bao (YYYY-MM-DD) hoac Enter cho hom nay: 2025-10-15
→ Chạy dự báo Tam Giác Mạch cho ngày 15/10/2025
→ Tự động mở HTML map trong browser
```

---

## 🎯 CÁCH 2: Dùng Python Script (Linh hoạt hơn)

```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe forecast_multi.py
```

**Menu có 3 modes**:

### Mode 1: Single date (Một ngày)
```
Input: 1 (Tam Giác Mạch)
       1 (Single date)
       2025-11-01
→ Dự báo cho ngày 1/11/2025
```

### Mode 2: Date range (Khoảng thời gian)
```
Input: 1 (Tam Giác Mạch)
       2 (Date range)
       2025-10-01
       2025-12-31
→ Dự báo mỗi tuần từ 1/10 đến 31/12 (13 lần)
```

### Mode 3: Suggested dates (Ngày đề xuất)
```
Input: 2 (Hoa Đào)
       3 (Suggested dates)
       y
→ Dự báo cho 4 ngày tối ưu: 15/1, 1/2, 15/2, 1/3
```

---

## 📅 CÁCH 3: Lệnh trực tiếp (Cho experts)

### A. Tam Giác Mạch - Ngày cụ thể

```powershell
# Dự báo ngày 15/10/2025
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py `
    --aoi Ha_Giang_TamGiacMach `
    --date 2025-10-15 `
    --models random_forest lstm gru `
    --threshold 0.5

# Mở kết quả
Start-Process "outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html"
```

### B. Hoa Đào - Ngày cụ thể

```powershell
# Dự báo ngày 15/2/2026 (mùa hoa đào)
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py `
    --aoi Moc_Chau_Prunus `
    --date 2026-02-15 `
    --models random_forest lstm `
    --threshold 0.6

# Mở kết quả
Start-Process "outputs\visualizations\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_map.html"
```

### C. Cả 2 loài - Cùng một ngày

```powershell
# Script PowerShell
$date = "2025-10-20"
$python = "C:\Users\Admin\anaconda3\envs\plantgpu\python.exe"

# Tam Giác Mạch
& $python main.py --aoi Ha_Giang_TamGiacMach --date $date --models random_forest

# Hoa Đào (ngoài mùa, xem thử)
& $python main.py --aoi Moc_Chau_Prunus --date $date --models random_forest

# Mở cả 2 maps
Start-Process "outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html"
Start-Process "outputs\visualizations\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_map.html"
```

---

## 🗓️ CÁCH 4: Dự báo cả mùa bloom

### A. Tam Giác Mạch (Tháng 10-12)

```powershell
# Tạo file: forecast_tam_giac_mach_season.bat
@echo off
set PYTHON=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

REM Week 1: Oct 1
%PYTHON% main.py --aoi Ha_Giang_TamGiacMach --date 2025-10-01 --models random_forest

REM Week 2: Oct 8
%PYTHON% main.py --aoi Ha_Giang_TamGiacMach --date 2025-10-08 --models random_forest

REM Week 3: Oct 15
%PYTHON% main.py --aoi Ha_Giang_TamGiacMach --date 2025-10-15 --models random_forest

REM ... (thêm các tuần khác)

REM Week 12: Dec 20
%PYTHON% main.py --aoi Ha_Giang_TamGiacMach --date 2025-12-20 --models random_forest

echo Done! Season forecast complete.
pause
```

### B. Hoa Đào (Tháng 1-3)

```powershell
# Tương tự cho mùa hoa đào
@echo off
set PYTHON=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

%PYTHON% main.py --aoi Moc_Chau_Prunus --date 2026-01-10 --models random_forest
%PYTHON% main.py --aoi Moc_Chau_Prunus --date 2026-01-20 --models random_forest
%PYTHON% main.py --aoi Moc_Chau_Prunus --date 2026-02-01 --models random_forest
%PYTHON% main.py --aoi Moc_Chau_Prunus --date 2026-02-15 --models random_forest
%PYTHON% main.py --aoi Moc_Chau_Prunus --date 2026-03-01 --models random_forest

echo Done!
pause
```

---

## 📊 XEM KẾT QUẢ

### A. Mở HTML Maps

```powershell
# Tam Giác Mạch
Start-Process "outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html"

# Hoa Đào
Start-Process "outputs\visualizations\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_map.html"
```

### B. So sánh CSV

```powershell
# Import cả 2 CSV để so sánh
$csv1 = Import-Csv "outputs\hotspots\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots.csv"
$csv2 = Import-Csv "outputs\hotspots\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots.csv"

Write-Host "Tam Giac Mach hotspots: $($csv1.Count)"
Write-Host "Hoa Dao hotspots: $($csv2.Count)"

# Xem TOP 5 mỗi loài
$csv1 | Sort-Object -Property bloom_probability -Descending | Select-Object -First 5 | Format-Table
$csv2 | Sort-Object -Property bloom_probability -Descending | Select-Object -First 5 | Format-Table
```

---

## 🎯 USE CASES THỰC TẾ

### Case 1: Lập kế hoạch du lịch

**Yêu cầu**: "Tháng 11 nên đi Hà Giang hay Mộc Châu?"

```powershell
# Test cả 2 địa điểm
.\predict_flowers.bat
# Chọn: 3 (ALL)
# Nhập ngày: 2025-11-15

# Kết quả:
# - Hà Giang: 45 hotspots (peak season) ✅ → ĐI ĐÂY
# - Mộc Châu: 2 hotspots (off-season) ❌
```

### Case 2: Nghiên cứu khoa học

**Yêu cầu**: "So sánh phenology của 2 loài hoa"

```powershell
# Dự báo cả năm cho 2 loài
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe forecast_multi.py
# Mode: 2 (Date range)
# Species: 3 (ALL)
# Range: 2025-01-01 to 2025-12-31

# Sau đó phân tích CSV với Python/R
import pandas as pd
import matplotlib.pyplot as plt

df1 = pd.read_csv("outputs/.../Ha_Giang_*_hotspots.csv")
df2 = pd.read_csv("outputs/.../Moc_Chau_*_hotspots.csv")

# Plot bloom probability theo thời gian
plt.plot(df1['date'], df1['bloom_probability'].mean(), label='Tam Giác Mạch')
plt.plot(df2['date'], df2['bloom_probability'].mean(), label='Hoa Đào')
plt.legend()
plt.show()
```

### Case 3: Dự báo hàng tuần

**Yêu cầu**: "Cập nhật forecast mỗi tuần cho mùa bloom"

```powershell
# Tạo scheduled task
# File: weekly_forecast.bat
@echo off
set PYTHON=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe
set TODAY=%date:~-4%-%date:~3,2%-%date:~0,2%

%PYTHON% main.py --aoi Ha_Giang_TamGiacMach --date %TODAY% --models random_forest

# Schedule trong Windows Task Scheduler:
# - Trigger: Every Monday 6:00 AM
# - Action: Run weekly_forecast.bat
```

---

## 🔧 TROUBLESHOOTING

### Vấn đề: "Không thấy hotspots"

**Nguyên nhân**: Ngày dự báo không trong mùa bloom

```powershell
# Sai: Dự báo Tam Giác Mạch tháng 5 (off-season)
.\predict_flowers.bat
# Input: 1, 2025-05-01
# Result: 0 hotspots ❌

# Đúng: Dự báo trong mùa
.\predict_flowers.bat  
# Input: 1, 2025-11-01
# Result: 45 hotspots ✅
```

### Vấn đề: "HTML không load"

```powershell
# Check file tồn tại
Test-Path "outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html"

# Nếu False → Chưa chạy workflow
# Nếu True → Mở bằng Chrome
Start-Process chrome "outputs\visualizations\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_map.html"
```

---

## 📈 KẾT QUẢ MẪU

### Tam Giác Mạch - 15/11/2025
```
Hotspots detected: 45
TOP location: (105.327, 23.164) - 93.4%
Optimal dates: Oct 20 - Dec 10
```

### Hoa Đào - 15/2/2026
```
Hotspots detected: 28
TOP location: (104.65, 20.85) - 89.2%
Optimal dates: Jan 15 - Mar 5
```

---

## 💡 TIPS

1. **Chạy nhanh**: Chỉ dùng Random Forest cho prototype
2. **Chạy chính xác**: Dùng cả 3 models (RF + LSTM + GRU)
3. **Batch processing**: Dùng `forecast_multi.py` cho nhiều ngày
4. **Visualization**: Luôn mở HTML để check spatial pattern

---

**Tóm tắt lệnh nhanh nhất**:
```powershell
# Tam Giác Mạch hôm nay
.\run_predict.bat

# Hoa Đào ngày cụ thể
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Moc_Chau_Prunus --date 2026-02-15

# Cả 2 loài
.\predict_flowers.bat → Chọn 3 (ALL)
```

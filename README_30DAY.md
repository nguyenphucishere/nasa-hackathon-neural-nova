# 🌸 30-DAY BLOOM CONDITION FORECAST - QUICK START

## ⚡ 3 BƯỚC ĐƠN GIẢN

### BƯỚC 1: Dự báo 30 ngày (10 phút)

```powershell
.\predict_30days.bat
```
- Chọn loài hoa (1-4)
- Tự động dự báo 30 ngày từ hôm nay
- Output: `outputs/hotspots/{AOI}/{AOI}_hotspots_timeseries.geojson`

### BƯỚC 2: Phân tích kết quả (2 phút)

```powershell
.\analyze_results.bat
```
- Tự động tìm file time-series mới nhất
- Tạo biểu đồ + báo cáo
- Output: `outputs/analysis/{AOI}/`

### BƯỚC 3: Xem kết quả

```powershell
# Mở thư mục kết quả
explorer outputs\analysis\Ha_Giang_TamGiacMach\

# Files:
# - {AOI}_daily_trends.png          ← Biểu đồ xu hướng
# - {AOI}_calendar_heatmap.png      ← Lịch nhiệt độ
# - {AOI}_summary_report.txt        ← Báo cáo tóm tắt
# - {AOI}_daily_stats.csv           ← Dữ liệu CSV
```

---

## 💡 HIỂU KẾT QUẢ

### Condition Score = Điều kiện Quang phổ Lý tưởng

| Score | Ý nghĩa | Khuyến nghị |
|-------|---------|-------------|
| 0.90-1.00 | Cực kỳ lý tưởng | ⭐⭐⭐ ĐI NGAY! |
| 0.70-0.89 | Tốt | ⭐⭐ Đáng đi |
| 0.50-0.69 | Khá | ⭐ Có thể có hoa |
| <0.50 | Không thuận | 🚫 Không nên đi |

**Lưu ý:** 
- ✅ Điều kiện lý tưởng ≠ Chắc chắn có hoa
- ✅ Cần xác nhận thực địa
- ✅ Kết hợp với thông tin địa phương

---

## 📊 EXAMPLE OUTPUT

```
================================================================================
30-DAY BLOOM CONDITION FORECAST SUMMARY
AOI: Ha_Giang_TamGiacMach
Date Range: 2025-10-05 → 2025-11-04
================================================================================

📊 OVERALL STATISTICS
Average condition score: 0.687
Peak condition score: 0.934
Best day: 2025-10-18

💡 RECOMMENDATIONS
🌟 Best week: Week 2 (2025-10-12 - 2025-10-18)
   Average score: 0.812

🎯 TOP 3 DAYS:
   1. 2025-10-18: Mean=0.893, Max=0.934  ← GO THIS DAY!
   2. 2025-10-17: Mean=0.867, Max=0.921
   3. 2025-10-16: Mean=0.845, Max=0.915
```

---

## 🎯 USE CASES

### Tourism: "Tháng 10 nên đi Hà Giang tuần nào?"
```powershell
.\predict_30days.bat → Chọn 1 (Tam Giác Mạch)
.\analyze_results.bat
# → Đọc report: Week 2 tốt nhất!
```

### Research: "So sánh Fansipan vs Putaleng"
```powershell
# Predict cả 2
python main.py --aoi Hoang_Lien_Rhododendron --date-start 2025-04-01
python main.py --aoi Lao_Cai_Rhododendron --date-start 2025-04-01

# Phân tích cả 2
.\analyze_results.bat
# → So sánh peak timing, duration, intensity
```

---

## 📚 DOCUMENTATION

- **Quick Start**: `README_30DAY.md` (this file)
- **Comprehensive Guide**: `COMPREHENSIVE_GUIDE.md` (chi tiết đầy đủ)
- **Scientific Basis**: `GUIDE_4_SPECIES_SCIENTIFIC.md`
- **30-Day Workflow**: `GUIDE_30DAY_FORECAST.md`

---

## ❓ FAQ

**Q: Tại sao "condition score" chứ không phải "bloom probability"?**  
A: Vì hệ thống đánh giá "điều kiện quang phổ lý tưởng", không dự đoán chính xác bloom event. Không cần ground truth!

**Q: Độ chính xác bao nhiêu %?**  
A: Không có accuracy number vì thiếu ground truth. Nhưng scores cao thường trùng với bloom season và reports từ users.

**Q: Có thể predict >30 days không?**  
A: Có! Nhưng độ tin cậy giảm. 30 ngày là balance tốt giữa usefulness và uncertainty.

**Q: Cần internet không?**  
A: Có! Cần kết nối Earth Engine để download Sentinel-2 data.

---

## 🚀 NEXT STEPS

1. ✅ Chạy demo với `predict_30days.bat`
2. ✅ Xem results với `analyze_results.bat`
3. 📖 Đọc `COMPREHENSIVE_GUIDE.md` để hiểu sâu hơn
4. 💬 Feedback welcome!

**Happy forecasting! 🌸**

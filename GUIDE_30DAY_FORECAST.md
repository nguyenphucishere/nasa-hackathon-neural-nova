# 📅 HƯỚNG DẪN DỰ BÁO 30 NGÀY

## 🎯 Khái niệm: "Bloom Condition Score"

Hệ thống **KHÔNG dự đoán chính xác bloom event**, mà đánh giá **điều kiện quang phổ lý tưởng** cho nở hoa.

### Điểm khác biệt:

| Cách hiểu SAI ❌ | Cách hiểu ĐÚNG ✅ |
|------------------|-------------------|
| "85% xác suất HOA ĐANG NỞ" | "85% điều kiện PHÙ HỢP cho nở hoa" |
| Ground truth cần: actual bloom dates | Không cần ground truth |
| Supervised learning | Unsupervised pattern matching |
| Binary: bloom/no-bloom | Continuous: 0-100% suitability |

### Cơ sở khoa học:

```
Bloom Condition Score = f(Spectral, Temporal, Environmental)

1. Spectral Match (60%):
   - High ARI (anthocyanin present) ✓
   - Low NDVI (flowers covering leaves) ✓
   - High NYI/CRI (yellow flowers) ✓
   → So sánh với "ideal signature" từ historical data

2. Temporal Suitability (20%):
   - Trong bloom window? (Oct-Dec cho Tam Giác Mạch)
   - Gần peak month? (November)
   → Điểm cao nếu đúng mùa

3. Environmental Suitability (20%):
   - Elevation phù hợp? (800-1500m)
   - Slope phù hợp? (10-30°)
   - Land cover phù hợp? (agricultural)
   → Điểm cao nếu đúng environmental niche
```

---

## 🚀 CÁCH SỬ DỤNG

### Option 1: Batch Script (Đơn giản)

```powershell
# Dự báo 30 ngày từ hôm nay
.\predict_30days.bat

# Chọn loài hoa (1-4)
# Script tự động lấy ngày hiện tại làm điểm bắt đầu
```

### Option 2: Command Line (Linh hoạt)

```powershell
# Dự báo 30 ngày từ ngày cụ thể
python main.py ^
  --aoi Ha_Giang_TamGiacMach ^
  --date-start 2025-10-05 ^
  --models random_forest lstm gru ^
  --top-n 50 ^
  --threshold 0.5

# Thay đổi parameters:
# --date-start: Ngày bắt đầu (YYYY-MM-DD)
# --top-n: Số hotspots giữ lại mỗi ngày (default: 50)
# --threshold: Ngưỡng điều kiện tối thiểu (0-1)
# --models: Các model sử dụng
```

---

## 📊 OUTPUT FORMAT

### 1. Time-Series GeoJSON (Chính)

**File**: `outputs/hotspots/{AOI}/{AOI}_hotspots_timeseries.geojson`

```json
{
  "type": "FeatureCollection",
  "metadata": {
    "aoi_name": "Ha_Giang_TamGiacMach",
    "date_range": {
      "start": "2025-10-05",
      "generated_end": "2025-11-04",
      "total_days": 30
    },
    "top_n_per_date": 50,
    "total_hotspots": 1500
  },
  "time_series": {
    "2025-10-05": {
      "features": [
        {
          "geometry": {"type": "Point", "coordinates": [105.327, 23.164]},
          "properties": {
            "bloom_condition_score": 0.934,
            "spectral_match": 0.91,
            "temporal_suitability": 0.95,
            "environmental_match": 0.98,
            "date": "2025-10-05"
          }
        }
        // ... 49 more top hotspots for this day
      ],
      "summary": {
        "total_hotspots": 50,
        "mean_score": 0.72,
        "max_score": 0.934
      }
    },
    "2025-10-06": {
      // Next day's top 50 hotspots
    }
    // ... 30 days total
  }
}
```

### 2. Visualization

**Interactive Timeline Map** (planned):
- Slider để xem từng ngày
- Heatmap thay đổi theo thời gian
- Animation 30 days

---

## 🎯 USE CASES

### 1. Tourism Planning

**Câu hỏi**: "Tuần nào trong tháng 10 nên đi Hà Giang?"

**Cách dùng**:
```powershell
# Dự báo từ 01/10 → 31/10
python main.py --aoi Ha_Giang_TamGiacMach --date-start 2025-10-01

# Phân tích output:
# - Week 1 (01-07/10): Mean score 0.45 → Chưa tốt
# - Week 2 (08-14/10): Mean score 0.68 → Khá tốt
# - Week 3 (15-21/10): Mean score 0.82 → RẤT TỐT ✓✓✓
# - Week 4 (22-28/10): Mean score 0.75 → Tốt
```

**Kết luận**: Nên đi tuần 15-21/10!

### 2. Research: Bloom Progression

**Mục tiêu**: Phân tích sự tiến triển của bloom trong không gian và thời gian

```python
# Analyze time-series data
import json
import pandas as pd

with open('Ha_Giang_TamGiacMach_hotspots_timeseries.geojson') as f:
    data = json.load(f)

# Extract daily summaries
daily_stats = []
for date, info in data['time_series'].items():
    daily_stats.append({
        'date': date,
        'mean_score': info['summary']['mean_score'],
        'max_score': info['summary']['max_score'],
        'n_hotspots': info['summary']['total_hotspots']
    })

df = pd.DataFrame(daily_stats)

# Detect peak bloom period
peak_start = df[df['mean_score'] > 0.75]['date'].min()
peak_end = df[df['mean_score'] > 0.75]['date'].max()
print(f"Peak bloom period: {peak_start} to {peak_end}")

# Spatial progression
# Analyze how bloom "moves" across landscape
```

### 3. Comparison: 2 Rhododendron Sites

```powershell
# Fansipan (1500-3200m)
python main.py --aoi Hoang_Lien_Rhododendron --date-start 2025-04-01

# Putaleng (2000-3400m, cao hơn)
python main.py --aoi Lao_Cai_Rhododendron --date-start 2025-04-01

# So sánh:
# - Peak timing: Fansipan có thể sớm hơn (elevation thấp hơn)
# - Duration: Putaleng có thể dài hơn (elevation cao, mát hơn)
# - Intensity: So sánh max_score
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Đây KHÔNG phải dự báo chính xác

```
❌ "Ngày 15/10 hoa SẼ NỞ tại tọa độ này"
✅ "Ngày 15/10 ĐIỀU KIỆN QUANG PHỔ phù hợp 85%"

→ Cần kiểm tra thực địa để confirm!
```

### 2. Các yếu tố không tính được

```
Hệ thống KHÔNG xem xét:
- Thời tiết đột ngột (mưa đá, sương muối)
- Con người (thu hoạch, chăn thả)
- Sâu bệnh
- Microclimate variations

→ Field validation luôn cần thiết!
```

### 3. Temporal smoothing đang thiếu

```
Hiện tại:
Day 1: 90% → Day 2: 30% → Day 3: 85%  # Erratic!

Cần implement:
Day 1: 90% → Day 2: 88% → Day 3: 85%  # Smooth progression
```

---

## 🔧 KẾ HOẠCH CẢI THIỆN

### Phase 1: Reframe Output (Khuyến nghị làm ngay)

```python
# Đổi tên trong code:
'bloom_probability' → 'bloom_condition_score'

# Thêm breakdown:
'spectral_match': 0.91,
'temporal_suitability': 0.95,
'environmental_match': 0.98,
'overall_score': 0.934

# Update documentation
```

### Phase 2: Temporal Smoothing

```python
# Apply Gaussian filter
from scipy.ndimage import gaussian_filter1d

def smooth_time_series(scores, sigma=2):
    """
    Smooth condition scores across time
    Prevents erratic day-to-day jumps
    """
    return gaussian_filter1d(scores, sigma=sigma)
```

### Phase 3: Environmental Filtering

```python
# Add DEM-based filtering
def filter_by_environment(predictions, aoi_config):
    """
    Set score = 0 for environmentally unsuitable locations
    """
    # Rhododendron: elevation < 1500m → score = 0
    # Tam Giac Mach: elevation > 1500m → score = 0
```

### Phase 4: Interactive Visualization

```html
<!-- Timeline slider map -->
<div id="map"></div>
<input type="range" min="0" max="29" value="0" id="day-slider">
<div id="date-display">2025-10-05</div>

<script>
// Update map when slider changes
// Show heatmap for selected day
// Animation button to play 30-day sequence
</script>
```

---

## 🤔 TRAO ĐỔI

### Câu hỏi cho bạn:

**1. Về terminology:**
- Bạn thích tên nào?
  - `bloom_condition_score`
  - `spectral_suitability_index`
  - `favorable_condition_index`
  - Hay tên khác?

**2. Về time-series:**
- 30 ngày có quá dài không? (có thể giảm xuống 14 ngày?)
- Top 50 hotspots/day có phù hợp? (tổng 1500 hotspots cho 30 ngày)
- Có cần daily summary statistics không?

**3. Về features:**
- Bạn muốn tôi implement:
  - ✅ Temporal smoothing?
  - ✅ Environmental filtering?
  - ✅ Interactive timeline map?
  - ✅ Daily summary reports?
  - Tất cả?

**4. Về validation:**
- Bạn có kế hoạch thu thập field data để validate không?
- Nếu có, format nào thuận tiện? (CSV, photos with GPS, etc.)

---

## 💡 ĐỀ XUẤT IMPLEMENTATION

Tôi có thể giúp bạn:

### 1. Fix ngay (5 phút):
- ✅ Tạo `predict_30days.bat` script (đã xong ở trên!)
- Rename output fields cho rõ ràng

### 2. Enhance (30 phút):
- Implement temporal smoothing
- Add environmental filtering
- Create daily summary statistics

### 3. Visualize (1 giờ):
- Interactive timeline map
- Animation 30-day progression
- Comparison charts (multi-species)

Bạn muốn bắt đầu từ đâu? 🌸

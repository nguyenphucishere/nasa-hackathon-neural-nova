# 📄 OUTPUT FORMAT - DAILY GEOJSON FILES

## 🎯 Cấu trúc Output mới

### Thay vì 1 file lớn chứa tất cả:
```
❌ OLD:
outputs/hotspots/Ha_Giang_TamGiacMach/
  └── Ha_Giang_TamGiacMach_hotspots_timeseries.geojson  (1 file, 30 days)
```

### Bây giờ: Mỗi ngày 1 file riêng:
```
✅ NEW:
outputs/hotspots/Ha_Giang_TamGiacMach/
  ├── Ha_Giang_TamGiacMach_hotspots_2025-10-05.geojson
  ├── Ha_Giang_TamGiacMach_hotspots_2025-10-06.geojson
  ├── Ha_Giang_TamGiacMach_hotspots_2025-10-07.geojson
  ├── ... (30 files total)
  ├── Ha_Giang_TamGiacMach_hotspots_2025-11-03.geojson
  ├── Ha_Giang_TamGiacMach_hotspots_2025-11-04.geojson
  └── Ha_Giang_TamGiacMach_timeseries_metadata.json  (summary)
```

---

## 📋 Format từng file (Standard GeoJSON)

### File: `Ha_Giang_TamGiacMach_hotspots_2025-10-05.geojson`

```json
{
  "type": "FeatureCollection",
  "name": "Ha_Giang_TamGiacMach_hotspots_2025-10-05",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "lon": 105.32700000000001,
        "lat": 23.164000000000001,
        "bloom_probability": 0.934,
        "date": "2025-10-05",
        "gi_star_z": 3.245,
        "gi_star_p": 0.001,
        "gi_star_significant": true,
        "hotspot_type": "Hot Spot",
        "cluster_id": 1,
        "is_noise": false,
        "combined_score": 0.912,
        "hotspot_rank": 1.0
      },
      "geometry": {
        "type": "Point",
        "coordinates": [105.327, 23.164]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "lon": 105.196,
        "lat": 23.196,
        "bloom_probability": 0.861,
        "date": "2025-10-05",
        "gi_star_z": 2.891,
        "gi_star_p": 0.004,
        "gi_star_significant": true,
        "hotspot_type": "Hot Spot",
        "cluster_id": 1,
        "is_noise": false,
        "combined_score": 0.875,
        "hotspot_rank": 2.0
      },
      "geometry": {
        "type": "Point",
        "coordinates": [105.196, 23.196]
      }
    }
    // ... 48 more features (top 50 hotspots for this day)
  ]
}
```

**Giải thích các field:**

| Field | Ý nghĩa | Example |
|-------|---------|---------|
| `bloom_probability` | Xác suất điều kiện nở hoa (0-1) | 0.934 = 93.4% |
| `date` | Ngày dự báo | "2025-10-05" |
| `gi_star_z` | Z-score của Getis-Ord Gi* | 3.245 (càng cao càng significant) |
| `gi_star_p` | P-value | 0.001 (< 0.05 = significant) |
| `gi_star_significant` | Có significant không? | true |
| `hotspot_type` | Loại hotspot | "Hot Spot", "Cold Spot", "Not Significant" |
| `cluster_id` | ID của cluster (DBSCAN) | 1, -1 (noise) |
| `is_noise` | Có phải noise point? | false |
| `combined_score` | Score tổng hợp | 0.912 |
| `hotspot_rank` | Thứ hạng trong ngày | 1.0 (tốt nhất) |

---

## 📊 Metadata File

### File: `Ha_Giang_TamGiacMach_timeseries_metadata.json`

```json
{
  "aoi_name": "Ha_Giang_TamGiacMach",
  "generated_at": "2025-10-05T14:30:00",
  "date_range": {
    "start": "2025-10-05",
    "end": "2025-11-04",
    "total_days": 30
  },
  "top_n_per_date": 50,
  "model_used": "lstm",
  "total_files": 30,
  "files": [
    "Ha_Giang_TamGiacMach_hotspots_2025-10-05.geojson",
    "Ha_Giang_TamGiacMach_hotspots_2025-10-06.geojson",
    "Ha_Giang_TamGiacMach_hotspots_2025-10-07.geojson",
    "..."
  ]
}
```

---

## 🔧 Cách sử dụng

### 1. Load trong QGIS/ArcGIS

```
File → Add Vector Layer → Add Files
→ Chọn tất cả 30 files .geojson
→ Tạo time-series animation!
```

### 2. Load trong Python

```python
import geopandas as gpd
from pathlib import Path
import pandas as pd

# Load all daily files
base_dir = Path('outputs/hotspots/Ha_Giang_TamGiacMach')
geojson_files = sorted(base_dir.glob('*_hotspots_????-??-??.geojson'))

# Combine into single GeoDataFrame
gdfs = []
for file in geojson_files:
    gdf = gpd.read_file(file)
    gdfs.append(gdf)

combined_gdf = pd.concat(gdfs, ignore_index=True)

# Filter by date
date_filter = combined_gdf['date'] == '2025-10-15'
hotspots_oct15 = combined_gdf[date_filter]

# Plot
hotspots_oct15.plot(column='bloom_probability', cmap='RdYlGn', 
                    legend=True, figsize=(12, 8))
```

### 3. Load trong JavaScript (Leaflet/Mapbox)

```javascript
// Load single day
fetch('outputs/hotspots/Ha_Giang_TamGiacMach/Ha_Giang_TamGiacMach_hotspots_2025-10-05.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        const prob = feature.properties.bloom_probability;
        const color = prob > 0.8 ? 'red' : prob > 0.6 ? 'orange' : 'yellow';
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: color,
          fillOpacity: 0.7
        });
      }
    }).addTo(map);
  });

// Create timeline slider
// Load all 30 files and switch on slider change
```

---

## 🎨 Ưu điểm Format mới

### ✅ Advantages:

1. **Standard GeoJSON** - Compatible với tất cả GIS tools
2. **CRS included** - Đầy đủ Coordinate Reference System
3. **Mỗi ngày 1 file** - Dễ filter, dễ share
4. **Nhỏ gọn** - Mỗi file ~100-500KB (thay vì 1 file 15MB)
5. **Flexible** - Load chỉ ngày cần thiết, không cần load hết
6. **Incremental updates** - Có thể thêm ngày mới mà không ảnh hưởng files cũ

### 📊 So sánh:

| Aspect | Old (1 big file) | New (30 small files) |
|--------|------------------|----------------------|
| File size | 15 MB | 30 × 500 KB = 15 MB total |
| Load time | ~5s (load all) | ~200ms (load 1 day) |
| QGIS import | Slow | Fast (selective) |
| Web display | Must download all | Load on-demand |
| Sharing | Heavy | Light (1 file/day) |
| Updates | Regenerate all | Add new day only |

---

## 🚀 Workflow

### Tạo daily files:

```powershell
# Dự báo 30 ngày
.\predict_30days.bat → Chọn 1

# Output:
# outputs/hotspots/Ha_Giang_TamGiacMach/
#   ├── Ha_Giang_TamGiacMach_hotspots_2025-10-05.geojson  ← Day 1
#   ├── Ha_Giang_TamGiacMach_hotspots_2025-10-06.geojson  ← Day 2
#   ├── ...
#   └── Ha_Giang_TamGiacMach_timeseries_metadata.json
```

### Phân tích:

```powershell
# Analysis script tự động load tất cả daily files
.\analyze_results.bat → Chọn Ha_Giang_TamGiacMach

# Tạo:
# - Daily trends plot
# - Calendar heatmap
# - Summary report
# - Daily stats CSV
```

---

## 💡 Tips

### Import vào QGIS:

1. Drag & drop tất cả 30 files vào QGIS
2. Right-click → Properties → Symbology
3. Categorized by `date` field
4. Time Controller: View → Panels → Temporal Controller
5. Play animation!

### Tạo animated GIF:

```python
import geopandas as gpd
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Load all days
files = sorted(Path('outputs/hotspots/AOI').glob('*.geojson'))
gdfs = [gpd.read_file(f) for f in files]

# Create animation
fig, ax = plt.subplots(figsize=(12, 8))

def update(frame):
    ax.clear()
    gdfs[frame].plot(ax=ax, column='bloom_probability', 
                     cmap='RdYlGn', vmin=0, vmax=1)
    ax.set_title(f"Day {frame+1}: {gdfs[frame]['date'].iloc[0]}")

anim = FuncAnimation(fig, update, frames=len(gdfs), interval=500)
anim.save('bloom_animation.gif', writer='pillow')
```

---

**Perfect format cho GIS analysis! 🎉**

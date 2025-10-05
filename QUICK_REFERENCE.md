# ⚡ QUICK REFERENCE - 30-DAY BLOOM FORECAST

## 🚀 3-STEP WORKFLOW

### Step 1: Predict (10 phút)
```powershell
.\predict_30days.bat
# Chọn loài (1-4)
# → Tạo 30 files GeoJSON (1 file/ngày)
```

### Step 2: Analyze (2 phút)
```powershell
.\analyze_results.bat
# Chọn AOI
# → Tạo plots + reports
```

### Step 3: View Results
```powershell
explorer outputs\analysis\{AOI}\
# Xem:
# - Daily trends plot
# - Calendar heatmap
# - Summary report
```

---

## 📁 OUTPUT STRUCTURE

```
outputs/
  hotspots/
    Ha_Giang_TamGiacMach/
      ├── Ha_Giang_TamGiacMach_hotspots_2025-10-05.geojson  ← Day 1
      ├── Ha_Giang_TamGiacMach_hotspots_2025-10-06.geojson  ← Day 2
      ├── ... (30 files)
      ├── Ha_Giang_TamGiacMach_hotspots_2025-11-04.geojson  ← Day 30
      └── Ha_Giang_TamGiacMach_timeseries_metadata.json     ← Summary
  
  analysis/
    Ha_Giang_TamGiacMach/
      ├── Ha_Giang_TamGiacMach_daily_trends.png
      ├── Ha_Giang_TamGiacMach_calendar_heatmap.png
      ├── Ha_Giang_TamGiacMach_summary_report.txt
      └── Ha_Giang_TamGiacMach_daily_stats.csv
```

---

## 📊 GEOJSON FORMAT (Mỗi file)

```json
{
  "type": "FeatureCollection",
  "name": "AOI_hotspots_2025-10-05",
  "crs": { 
    "type": "name", 
    "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } 
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "lon": 105.327,
        "lat": 23.164,
        "bloom_probability": 0.934,     ← Condition score (0-1)
        "date": "2025-10-05",           ← Ngày dự báo
        "gi_star_z": 3.245,             ← Spatial autocorrelation
        "gi_star_p": 0.001,
        "gi_star_significant": true,
        "hotspot_type": "Hot Spot",
        "cluster_id": 1,
        "hotspot_rank": 1.0
      },
      "geometry": {
        "type": "Point",
        "coordinates": [105.327, 23.164]
      }
    }
    // ... 49 more features (top 50/day)
  ]
}
```

---

## 💡 INTERPRETATION GUIDE

### Bloom Condition Score:

| Score | Meaning | Action |
|-------|---------|--------|
| 0.90-1.00 | Excellent | ⭐⭐⭐ GO NOW! |
| 0.70-0.89 | Good | ⭐⭐ Recommended |
| 0.50-0.69 | Moderate | ⭐ Possible blooms |
| <0.50 | Unfavorable | 🚫 Not recommended |

### Example Summary Report:

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
   1. 2025-10-18: Mean=0.893, Max=0.934  ← BEST DAY!
   2. 2025-10-17: Mean=0.867, Max=0.921
   3. 2025-10-16: Mean=0.845, Max=0.915
```

---

## 🔧 COMMON TASKS

### Load trong QGIS:

```
1. Drag all 30 .geojson files vào QGIS
2. Symbology → Graduated → bloom_probability
3. Temporal Controller → Enable
4. Play time-series animation!
```

### Load trong Python:

```python
import geopandas as gpd
from pathlib import Path

# Load all daily files
base_dir = Path('outputs/hotspots/Ha_Giang_TamGiacMach')
files = sorted(base_dir.glob('*_hotspots_????-??-??.geojson'))

# Load specific day
gdf = gpd.read_file(files[0])  # Day 1

# Or combine all
import pandas as pd
gdfs = [gpd.read_file(f) for f in files]
combined = pd.concat(gdfs, ignore_index=True)
```

### Filter by score:

```python
# High probability locations on specific day
high_prob = gdf[gdf['bloom_probability'] > 0.8]

# Significant hotspots only
significant = gdf[gdf['gi_star_significant'] == True]

# Top 10 locations
top10 = gdf.nlargest(10, 'bloom_probability')
```

---

## 🎯 USE CASES

### 1. Tourism Planning

**Q:** "Tuần nào trong tháng 10 nên đi Hà Giang?"

**A:**
```powershell
.\predict_30days.bat → 1 (Tam Giác Mạch)
.\analyze_results.bat
# Đọc report → Week 2 có mean score 0.812
# Decision: Book tour 15-18/10!
```

### 2. Compare Locations

**Q:** "Fansipan vs Putaleng, nơi nào đẹp hơn?"

**A:**
```powershell
# Predict both
python main.py --aoi Hoang_Lien_Rhododendron --date-start 2025-04-01
python main.py --aoi Lao_Cai_Rhododendron --date-start 2025-04-01

# Compare reports
# Fansipan: Peak 05-12/04
# Putaleng: Peak 10-18/04
# → Fansipan nở sớm hơn!
```

### 3. Find Best Coordinates

**Q:** "Tọa độ nào có bloom tốt nhất?"

**A:**
```python
import geopandas as gpd

# Load best day (from report: 2025-10-18)
gdf = gpd.read_file('Ha_Giang_TamGiacMach_hotspots_2025-10-18.geojson')

# Get top location
best = gdf.nlargest(1, 'bloom_probability').iloc[0]
print(f"Best location: ({best['lon']}, {best['lat']})")
print(f"Condition score: {best['bloom_probability']:.3f}")
# → Use for navigation!
```

---

## 📚 DOCUMENTATION

| File | Content |
|------|---------|
| `README_30DAY.md` | Quick start guide |
| `COMPREHENSIVE_GUIDE.md` | Detailed methodology |
| `OUTPUT_FORMAT_DAILY.md` | GeoJSON format spec |
| `GUIDE_4_SPECIES_SCIENTIFIC.md` | Scientific basis |

---

## ⚠️ IMPORTANT NOTES

### What this is:

✅ Condition suitability assessment (spectral + temporal + environmental)  
✅ Probability of favorable conditions  
✅ Guidance for planning visits  

### What this is NOT:

❌ Exact bloom event prediction  
❌ Guaranteed flower presence  
❌ Ground truth validation  

**Always verify with local sources before traveling!**

---

## 🆘 TROUBLESHOOTING

### Issue: No daily files generated

**Solution:**
```powershell
# Check if prediction completed
dir outputs\hotspots\{AOI}\*.geojson

# If empty, re-run:
.\predict_30days.bat
```

### Issue: Analysis fails

**Solution:**
```powershell
# Check Python environment
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe --version

# Check dependencies
pip list | findstr "pandas matplotlib seaborn"

# Re-run analysis
.\analyze_results.bat
```

### Issue: QGIS can't load files

**Solution:**
- Files must be valid GeoJSON (check with https://geojsonlint.com/)
- CRS must be included (format handles this automatically)
- Try loading 1 file first, then add more

---

**Happy Forecasting! 🌸**

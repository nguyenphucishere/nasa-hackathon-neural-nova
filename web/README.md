# 🌸 Website Dự báo Nở Hoa - Hướng dẫn Sử dụng

## 📋 Tổng quan

Website thuần HTML/CSS/JavaScript để visualize và tương tác với dữ liệu dự báo nở hoa từ Sentinel-2.

---

## 🚀 Cài đặt & Chạy

### Bước 1: Chuẩn bị dữ liệu

Chạy script merge để tạo file GeoJSON:

```powershell
# Merge daily files thành 1 file duy nhất
python merge_daily_geojson.py --aoi Ha_Giang_TamGiacMach
python merge_daily_geojson.py --aoi Moc_Chau_Prunus
python merge_daily_geojson.py --aoi Hoang_Lien_Rhododendron
python merge_daily_geojson.py --aoi Lao_Cai_Rhododendron
```

### Bước 2: Copy files GeoJSON vào thư mục web

```powershell
# Copy từ outputs sang web folder
Copy-Item "outputs\hotspots\Ha_Giang_TamGiacMach\Ha_Giang_TamGiacMach_hotspots_timeseries.geojson" "web\"
Copy-Item "outputs\hotspots\Moc_Chau_Prunus\Moc_Chau_Prunus_hotspots_timeseries.geojson" "web\"
Copy-Item "outputs\hotspots\Hoang_Lien_Rhododendron\Hoang_Lien_Rhododendron_hotspots_timeseries.geojson" "web\"
Copy-Item "outputs\hotspots\Lao_Cai_Rhododendron\Lao_Cai_Rhododendron_hotspots_timeseries.geojson" "web\"
```

### Bước 3: Chạy local web server

**Option A: Python HTTP Server**
```powershell
cd web
python -m http.server 8000
```

**Option B: VS Code Live Server**
1. Cài extension "Live Server"
2. Right-click vào `index.html`
3. Chọn "Open with Live Server"

**Option C: Node.js http-server**
```powershell
npm install -g http-server
cd web
http-server -p 8000
```

### Bước 4: Mở trình duyệt

Truy cập: http://localhost:8000

---

## 📁 Cấu trúc thư mục

```
web/
├── index.html                                           # Main HTML
├── style.css                                            # Stylesheet
├── app.js                                               # JavaScript logic
├── README.md                                            # This file
├── Ha_Giang_TamGiacMach_hotspots_timeseries.geojson    # Data
├── Moc_Chau_Prunus_hotspots_timeseries.geojson         # Data
├── Hoang_Lien_Rhododendron_hotspots_timeseries.geojson # Data
└── Lao_Cai_Rhododendron_hotspots_timeseries.geojson    # Data
```

---

## 🎯 Tính năng

### 1. **Chọn loài hoa** 🌸
- Dropdown để chọn giữa 4 loài:
  - Tam Giác Mạch (Hà Giang)
  - Hoa Mận (Mộc Châu)
  - Đỗ Quyên (Fansipan)
  - Đỗ Quyên (Putaleng)
- Tự động load dữ liệu tương ứng
- Map tự động zoom đến vị trí

### 2. **Timeline slider** 📅
- Chọn ngày từ 05/10/2025 → 04/11/2025 (30 ngày)
- Cập nhật map real-time khi kéo slider
- Hiển thị ngày hiện tại rõ ràng

### 3. **Filter** 🎛️
- ⭐ Chỉ hiện điểm ý nghĩa thống kê
- Lọc theo gi_star_significant = true

### 4. **Interactive map** 🗺️
- Leaflet map với OpenStreetMap tiles
- Markers màu sắc theo bloom_probability:
  - 🔴 Đỏ: ≥70% (Rất cao)
  - 🟠 Cam: 60-70% (Cao)
  - 🟡 Vàng: 50-60% (Trung bình)
  - 🔵 Xanh nhạt: 40-50% (Thấp)
  - 🔵 Xanh đậm: <40% (Rất thấp)
- Click marker → Popup với thông tin cơ bản
- Click popup → Detail panel với đầy đủ thông tin

### 5. **Statistics panel** 📊
- Tổng điểm (tất cả)
- Điểm hiển thị (sau filter)
- Xác suất trung bình
- Xác suất cao nhất

### 6. **Detail panel** 📍
Chi tiết từng điểm bao gồm:
- Ngày dự báo
- Tọa độ (lat, lon)
- Xác suất nở hoa (với progress bar)
- Phân tích không gian (Gi* Z-score, P-value)
- Phân cụm (Cluster ID, Is Noise)
- Copy tọa độ
- Mở Google Maps

### 7. **Export data** 💾
- Xuất dữ liệu hiện tại (ngày + filter)
- Format: GeoJSON chuẩn
- Download trực tiếp

---

## 🎨 Customization

### Thêm loài hoa mới

**1. Sửa HTML (index.html):**
```html
<select id="speciesSelect" class="species-select">
    <!-- Existing options -->
    <option value="Your_New_Species">Tên Hoa - Địa điểm</option>
</select>
```

**2. Sửa JavaScript (app.js):**
```javascript
const speciesConfig = {
    // Existing configs
    'Your_New_Species': {
        name: 'Tên Hoa',
        location: 'Địa điểm',
        center: [lat, lon],
        zoom: 10,
        icon: '🌻'
    }
};
```

**3. Copy file GeoJSON:**
```powershell
Copy-Item "outputs\hotspots\Your_New_Species\Your_New_Species_hotspots_timeseries.geojson" "web\"
```

### Thay đổi màu sắc

Sửa hàm `getColorByProbability()` trong `app.js`:

```javascript
function getColorByProbability(prob) {
    if (prob >= 0.7) return '#YOUR_COLOR_1';
    if (prob >= 0.6) return '#YOUR_COLOR_2';
    // ...
}
```

### Thay đổi map tiles

Sửa trong `initializeMap()`:

```javascript
// Satellite view
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
}).addTo(map);

// Terrain view
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenTopoMap'
}).addTo(map);
```

---

## 🐛 Troubleshooting

### Lỗi: "Failed to load GeoJSON"

**Nguyên nhân:** File không tồn tại hoặc đường dẫn sai

**Giải pháp:**
1. Kiểm tra file có trong folder `web/`:
   ```powershell
   dir web\*.geojson
   ```

2. Đảm bảo tên file chính xác:
   - `Ha_Giang_TamGiacMach_hotspots_timeseries.geojson`
   - Không có space, dấu đặc biệt

3. Chạy từ web server (không mở file:// trực tiếp)

### Lỗi: CORS Policy

**Nguyên nhân:** Mở file HTML trực tiếp (file://)

**Giải pháp:** Dùng HTTP server:
```powershell
python -m http.server 8000
```

### Map không hiển thị

**Nguyên nhân:** Chưa load Leaflet CSS/JS

**Giải pháp:** Kiểm tra internet connection (CDN links)

### Markers không hiện

**Nguyên nhân:** Không có data cho ngày đó

**Giải pháp:** 
1. Check console log
2. Thử chuyển ngày khác
3. Bỏ filter "Significant only"

---

## 📊 Performance Tips

### Large dataset (>1000 features)

**1. Cluster markers:**
```javascript
// Add Leaflet.markercluster
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>

// In code
const markers = L.markerClusterGroup();
// Add markers to cluster
```

**2. Limit features per day:**
```javascript
// Only show top N features
const features = allFeatures
    .sort((a, b) => b.properties.bloom_probability - a.properties.bloom_probability)
    .slice(0, 100); // Top 100
```

**3. Lazy loading:**
```javascript
// Load data on demand instead of all at once
async function loadSpeciesData(speciesName) {
    // Load only when user selects
}
```

---

## 🚀 Deployment

### GitHub Pages

```bash
# 1. Push to GitHub
git add web/
git commit -m "Add bloom prediction website"
git push origin main

# 2. Settings → Pages → Source: main branch, /web folder
```

### Netlify

```bash
# 1. Drop web/ folder vào Netlify
# 2. Deploy!
```

### Vercel

```bash
vercel deploy web/
```

---

## 📝 TODO / Future Improvements

- [ ] Add time-series animation (auto-play dates)
- [ ] Compare multiple species side-by-side
- [ ] Export to PDF report
- [ ] Historical data comparison
- [ ] Weather overlay (temperature, rainfall)
- [ ] Mobile app version (PWA)
- [ ] Multi-language support (EN/VI)
- [ ] User accounts & saved locations
- [ ] Email notifications for high probability days

---

## 📞 Support

**Issues?** Check:
1. Browser console (F12) for errors
2. Network tab for failed requests
3. README troubleshooting section

**Questions?** Contact Neural Nova Team!

---

**Enjoy your bloom forecasting! 🌸✨**

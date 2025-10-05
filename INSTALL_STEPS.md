# 🚀 Hướng dẫn Cài đặt Nhanh

## ✅ Đã hoàn thành
- [x] Python environment (plantgpu)
- [x] PyTorch + CUDA
- [x] Earth Engine authentication

## 📦 Các bước tiếp theo

### Bước 1: Kiểm tra packages hiện tại

```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe check_packages.py
```

### Bước 2: Cài đặt packages còn thiếu

**Option A: Dùng script tự động (KHUYẾN KHÍCH)**
```powershell
.\install_missing.bat
```

**Option B: Cài từng nhóm (nếu Option A lỗi)**

```powershell
# Nhóm 1: Cơ bản
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -m pip install pyyaml python-dotenv tqdm joblib

# Nhóm 2: Geospatial (có thể mất 5-10 phút)
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -m pip install geopandas

# Nhóm 3: Spatial analysis
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -m pip install esda libpysal

# Nhóm 4: Visualization  
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -m pip install folium plotly

# Nhóm 5: Optional
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -m pip install scikit-learn-extra
```

### Bước 3: Test lại hệ thống

```powershell
.\run_demo.bat
```

## 🐛 Nếu gặp lỗi GeoPandas

GeoPandas có nhiều dependencies phức tạp. Nếu cài thất bại:

```powershell
# Cài dependencies trước
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -m pip install shapely fiona pyproj

# Sau đó cài geopandas
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -m pip install geopandas
```

## 🎯 Kết quả mong đợi

Sau khi cài đặt xong, chạy `run_demo.bat` sẽ thấy:

```
✓ Test 1: Loading configuration... ✅
✓ Test 2: Earth Engine initialization... ✅
✓ Test 3: GPU detection... ✅
✓ Test 4: Data collector initialization... ✅
✓ Test 5: Model imports... ✅
✓ Test 6: Spatial analysis tools... ✅
✓ Test 7: Visualization tools... ✅
✓ Test 8: Workflow initialization... ✅
```

## 📊 Timeline ước tính

- ✅ Configuration: Hoàn thành
- ✅ Earth Engine: Hoàn thành
- ✅ GPU: Hoàn thành
- 🔄 GeoPandas: 5-10 phút
- 🔄 Spatial libs: 2-3 phút
- 🔄 Visualization: 2-3 phút

**Tổng thời gian**: ~10-15 phút

## ✨ Sau khi hoàn tất

```powershell
# Chạy workflow thực tế
.\run_direct.bat
```

Hoặc:

```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Ha_Giang_TamGiacMach
```

---

**Lưu ý**: Nếu vẫn gặp lỗi import, restart terminal và chạy lại demo.

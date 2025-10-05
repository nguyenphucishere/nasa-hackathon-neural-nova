# Quick Reference - Sử dụng đường dẫn Python trực tiếp

## 🔧 Đường dẫn Python Environment

```
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe
```

## 🚀 Cách sử dụng

### 1. Cài đặt Dependencies

**Sử dụng batch script:**
```powershell
.\install.bat
```

**Hoặc trực tiếp:**
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -m pip install -r requirements.txt
```

### 2. Chạy Demo Test

**Sử dụng batch script:**
```powershell
.\run_demo.bat
```

**Hoặc trực tiếp:**
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe demo.py
```

### 3. Chạy Full Workflow

**Sử dụng batch script:**
```powershell
.\run_direct.bat
```

**Hoặc trực tiếp:**
```powershell
# Với AOI mặc định
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Ha_Giang_TamGiacMach

# Với custom parameters
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Ha_Giang_TamGiacMach --models random_forest lstm gru --train-years 5

# Chỉ Random Forest
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Moc_Chau_Prunus --models random_forest
```

### 4. Các Commands Hữu ích

**Kiểm tra Python version:**
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe --version
```

**Kiểm tra GPU:**
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -c "import torch; print(f'CUDA: {torch.cuda.is_available()}')"
```

**List installed packages:**
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -m pip list
```

**Authenticate Earth Engine:**
```powershell
earthengine authenticate
```

**Check Earth Engine:**
```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -c "import ee; ee.Initialize(project='genial-upgrade-467713-n9'); print('EE OK')"
```

## 📂 File Batch Scripts Đã tạo

| Script | Mục đích |
|--------|----------|
| `install.bat` | Cài đặt tất cả dependencies |
| `run_demo.bat` | Chạy demo test để kiểm tra hệ thống |
| `run_direct.bat` | Chạy workflow chính |
| `run_workflow.bat` | (Cũ) Sử dụng conda run |

## 🎯 Workflow Hoàn chỉnh

### Lần đầu setup:

1. **Cài đặt:**
   ```powershell
   .\install.bat
   ```

2. **Xác thực Earth Engine:**
   ```powershell
   earthengine authenticate
   ```

3. **Test hệ thống:**
   ```powershell
   .\run_demo.bat
   ```

4. **Chạy workflow:**
   ```powershell
   .\run_direct.bat
   ```

### Các lần sau:

```powershell
# Chỉ cần chạy
.\run_direct.bat

# Hoặc custom
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Ha_Giang_TamGiacMach --models lstm
```

## 🐛 Troubleshooting

### Nếu báo lỗi "python.exe not found":

Kiểm tra đường dẫn thực tế:
```powershell
dir C:\Users\Admin\anaconda3\envs\plantgpu\python.exe
```

Nếu khác, cập nhật biến `PYTHON_PATH` trong các file .bat

### Nếu thiếu packages:

```powershell
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe -m pip install <package-name>
```

### Nếu lỗi import:

Đảm bảo chạy từ thư mục gốc dự án:
```powershell
cd d:\Hyperspectral_ROI
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe demo.py
```

## 📝 Tùy chỉnh Scripts

Nếu cần thay đổi đường dẫn Python, edit các file .bat:

```batch
SET PYTHON_PATH=C:\Users\YourName\anaconda3\envs\yourenv\python.exe
```

---

**Tip:** Sử dụng Tab completion trong PowerShell để tránh gõ đường dẫn dài!

# 🔧 HOTFIX - CNN3D_LSTM MODEL FALLBACK

## ✅ ĐÃ SỬA

### Vấn đề
```
⚠️  Unknown model type: cnn3d_lstm
```

Model `cnn3d_lstm` được **thêm vào config.yaml** nhưng **chưa implement code**.

---

## 🛠️ Giải pháp

### 1. Workflow Fallback (`src/workflow/bloom_workflow.py`)

**Thay đổi**:
```python
# TRƯỚC (chỉ hỗ trợ lstm, gru)
elif model_type in ['lstm', 'gru']:
    model = self._train_deep_learning(...)

# SAU (hỗ trợ tất cả, với fallback)
elif model_type in ['lstm', 'gru', 'cnn_lstm', 'cnn3d_lstm', 'attention_lstm']:
    model = self._train_deep_learning(...)
```

**Thêm mapping**:
```python
model_mapping = {
    'cnn_lstm': 'lstm',        # Fallback to LSTM
    'cnn3d_lstm': 'lstm',      # Fallback to LSTM
    'attention_lstm': 'lstm',  # Fallback to LSTM
    'transformer': 'lstm'      # Fallback to LSTM
}
```

**Output mới**:
```
Training CNN3D_LSTM model...
----------------------------------------------------------------------
ℹ️  CNN3D_LSTM not fully implemented yet
ℹ️  Using LSTM as fallback
💡 Note: Full implementation coming in future update
✅ Built LSTM model
```

---

### 2. Batch Script Update (`predict_flowers.bat`)

**Thêm thông báo**:
```bat
echo Note: cnn3d_lstm will fallback to lstm (full implementation coming soon)
```

---

## 📊 KẾT QUẢ

### Trước khi sửa
```
Training CNN3D_LSTM model...
----------------------------------------------------------------------
⚠️  Unknown model type: cnn3d_lstm
⏭️  Skipping cnn3d_lstm...

→ Chỉ chạy random_forest và lstm
```

### Sau khi sửa
```
Training CNN3D_LSTM model...
----------------------------------------------------------------------
ℹ️  CNN3D_LSTM not fully implemented yet
ℹ️  Using LSTM as fallback
💡 Note: Full implementation coming in future update

Building LSTM model...
✅ Built LSTM model (3 models total)

→ Chạy đầy đủ 3 models: random_forest, lstm, cnn3d_lstm (as lstm)
```

---

## 🎯 HOẠT ĐỘNG NHƯ THẾ NÀO?

### Workflow
```
User request: --models random_forest lstm cnn3d_lstm
                                              ↓
                              Check if implemented? NO
                                              ↓
                              Use fallback mapping
                                              ↓
                    cnn3d_lstm → lstm (thông báo cho user)
                                              ↓
                              Train LSTM model
                                              ↓
                Save as "cnn3d_lstm" (để tracking)
```

### Model Results
```python
model_results = {
    'random_forest': {..., val_score: 0.002106},
    'lstm': {..., val_score: 0.002543},
    'cnn3d_lstm': {..., val_score: 0.002543}  # Same as LSTM!
}
```

**Note**: `cnn3d_lstm` sẽ có kết quả giống hệt `lstm` vì thực chất là cùng model.

---

## 🚀 SỬ DỤNG

### Commands vẫn giữ nguyên
```powershell
# Vẫn dùng cnn3d_lstm như bình thường
.\predict_flowers.bat → 3 → 2025-04-15

# Hoặc CLI
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py ^
  --aoi Hoang_Lien_Rhododendron ^
  --date 2025-04-15 ^
  --models random_forest lstm cnn3d_lstm ^
  --threshold 0.6
```

**System sẽ**:
1. ✅ Chấp nhận `cnn3d_lstm`
2. ℹ️ Thông báo fallback
3. ✅ Train LSTM model
4. ✅ Lưu kết quả
5. ✅ Tiếp tục workflow bình thường

---

## 📋 MODELS ĐƯỢC HỖ TRỢ

### Fully Implemented ✅
```
- random_forest
- lstm
- gru
```

### Fallback to LSTM ⚠️
```
- cnn_lstm       → lstm
- cnn3d_lstm     → lstm
- attention_lstm → lstm
- transformer    → lstm
```

---

## 🔮 FUTURE IMPLEMENTATION

### Phase 1 (Gần nhất)
```python
# CNN-LSTM: Spatial + Temporal
class CNNLSTMModel(nn.Module):
    def __init__(self):
        self.cnn = nn.Conv2d(...)  # Extract spatial features
        self.lstm = nn.LSTM(...)   # Model temporal
```

### Phase 2 (Trung hạn)
```python
# 3D-CNN-LSTM: Spatial-Spectral + Temporal
class CNN3DLSTMModel(nn.Module):
    def __init__(self):
        self.cnn3d = nn.Conv3d(...)  # Extract spatial-spectral
        self.lstm = nn.LSTM(...)     # Model temporal
```

### Phase 3 (Dài hạn)
```python
# Attention-LSTM: Focus on critical time steps
class AttentionLSTM(nn.Module):
    def __init__(self):
        self.lstm = nn.LSTM(...)
        self.attention = nn.MultiheadAttention(...)
```

---

## 📊 PERFORMANCE COMPARISON

| Model | Thời gian | Val MSE | Status |
|-------|-----------|---------|--------|
| Random Forest | 2 phút | 0.002106 | ✅ Implemented |
| LSTM | 10 phút | 0.002543 | ✅ Implemented |
| GRU | 8 phút | ~0.0025 | ✅ Implemented |
| CNN-LSTM | - | - | ⚠️ Fallback → LSTM |
| 3D-CNN-LSTM | - | - | ⚠️ Fallback → LSTM |

---

## 🐛 TROUBLESHOOTING

### Q: Tại sao không implement ngay?
**A**: Implementation đúng cần:
1. Preprocessing spatial patches (CNN input)
2. 3D convolution cho hyperspectral cubes
3. Feature fusion giữa CNN và LSTM
4. Testing và validation

→ Cần thời gian phát triển & test (~1-2 tuần)

### Q: Kết quả có chính xác không?
**A**: 
- ✅ **CÓ**: LSTM vẫn là model mạnh cho time series
- ⚠️ **NHƯNG**: Không tận dụng được spatial-spectral features
- 💡 **GIẢI PHÁP**: Đợi full implementation hoặc dùng `lstm` + manual feature engineering

### Q: Nên dùng model nào cho Đỗ Quyên?
**A**: **Hiện tại**:
```powershell
# Tốt nhất hiện có
--models random_forest lstm gru
```

**Tương lai** (khi có 3D-CNN-LSTM):
```powershell
# Optimal
--models random_forest lstm cnn3d_lstm
```

---

## 📝 SUMMARY

### ✅ Đã fix
- [x] Workflow nhận diện `cnn3d_lstm`
- [x] Fallback tự động sang `lstm`
- [x] Thông báo rõ ràng cho user
- [x] Workflow vẫn chạy đầy đủ
- [x] Batch script có note

### ⏳ Chưa implement
- [ ] CNN-LSTM architecture
- [ ] 3D-CNN-LSTM architecture
- [ ] Attention-LSTM architecture
- [ ] Transformer architecture

### 💡 Workaround
**Dùng `lstm` hoặc `gru` thay vì `cnn3d_lstm`**:
```powershell
# Thay vì
--models random_forest lstm cnn3d_lstm

# Dùng
--models random_forest lstm gru
# hoặc
--models random_forest lstm
```

---

**Date**: October 2025  
**Status**: ✅ HOTFIX APPLIED  
**Impact**: System vẫn chạy, không bị crash, có thông báo rõ ràng

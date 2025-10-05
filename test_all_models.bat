@echo off
REM Test with all 3 models
echo ========================================
echo Testing ALL Models (RF + LSTM + GRU)
echo This may take 10-15 minutes
echo ========================================
C:\Users\Admin\anaconda3\envs\plantgpu\python.exe main.py --aoi Ha_Giang_TamGiacMach --models random_forest lstm gru --threshold 0.5
pause

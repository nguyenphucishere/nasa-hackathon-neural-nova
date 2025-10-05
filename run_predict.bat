@echo off
REM Bloom Forecasting with Date Selection
REM Usage: run_predict.bat [DATE]
REM Example: run_predict.bat 2020-06-20

set PYTHON=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

if "%1"=="" (
    echo ========================================
    echo Running forecast for CURRENT DATE
    echo Models: Random Forest + LSTM + GRU
    echo Threshold: 50%%
    echo ========================================
    %PYTHON% main.py --aoi Ha_Giang_TamGiacMach --models random_forest lstm gru --threshold 0.5
) else (
    echo ========================================
    echo Running forecast for DATE: %1
    echo Models: Random Forest + LSTM + GRU  
    echo Threshold: 50%%
    echo ========================================
    %PYTHON% main.py --aoi Ha_Giang_TamGiacMach --date %1 --models random_forest lstm gru --threshold 0.5
)

echo.
echo ========================================
echo Done! Check outputs folder for:
echo - Heatmap: outputs/visualizations/.../hotspots_map.html
echo - Hotspots CSV: outputs/hotspots/.../hotspots.csv
echo ========================================
pause

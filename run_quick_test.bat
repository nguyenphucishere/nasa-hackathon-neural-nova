@echo off
REM Quick test with minimal settings - Chi chay Random Forest model
echo ========================================
echo Quick Workflow Test
echo Chi chay Random Forest (nhanh nhat)
echo ========================================
echo.

set PYTHON_PATH=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

%PYTHON_PATH% main.py --aoi Ha_Giang_TamGiacMach --models random_forest

echo.
echo ========================================
echo Test complete!
echo Check outputs folder for results
echo ========================================
pause

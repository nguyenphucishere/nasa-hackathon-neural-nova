@echo off
REM Install missing spatial packages using direct Python path
REM Cai dat cac package con thieu su dung duong dan truc tiep

echo ========================================
echo Installing Missing Spatial Packages
echo Cai dat cac package con thieu
echo ========================================
echo.

set PYTHON_PATH=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo Using Python: %PYTHON_PATH%
echo.

echo Step 1/5: Installing GeoPandas...
echo (This may take 5-10 minutes - Rat nhieu dependencies)
%PYTHON_PATH% -m pip install geopandas
echo.

echo Step 2/5: Installing PySAL ecosystem...
%PYTHON_PATH% -m pip install libpysal esda
echo.

echo Step 3/5: Installing Folium (maps)...
%PYTHON_PATH% -m pip install folium
echo.

echo Step 4/5: Installing Plotly (dashboards)...
%PYTHON_PATH% -m pip install plotly kaleido
echo.

echo Step 5/5: Installing YAML support...
%PYTHON_PATH% -m pip install pyyaml
echo.

echo ========================================
echo Installation Complete!
echo Cai dat hoan tat!
echo ========================================
echo.
echo Now run the demo test:
echo   .\run_demo.bat
echo.
pause

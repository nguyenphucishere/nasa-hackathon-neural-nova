@echo off
REM Install missing spatial and geospatial packages

SET PYTHON_PATH=C:\Users\Admin\anaconda3\envs\plantgpu\python.exe

echo ================================================
echo   Installing Missing Packages
echo ================================================
echo.

echo [1/5] Installing geopandas and dependencies...
%PYTHON_PATH% -m pip install geopandas

echo.
echo [2/5] Installing spatial analysis libraries (esda, libpysal)...
%PYTHON_PATH% -m pip install esda libpysal

echo.
echo [3/5] Installing visualization libraries...
%PYTHON_PATH% -m pip install folium plotly

echo.
echo [4/5] Installing remaining packages...
%PYTHON_PATH% -m pip install pyyaml python-dotenv tqdm joblib

echo.
echo [5/5] Installing scikit-learn-extra...
%PYTHON_PATH% -m pip install scikit-learn-extra

echo.
echo ================================================
echo   Installation Complete!
echo ================================================
echo.
echo Now run: run_demo.bat
echo.
pause

"""
Simple installation check script
"""
import sys

print("Checking installed packages...\n")

packages_to_check = [
    ('numpy', 'NumPy'),
    ('pandas', 'Pandas'),
    ('sklearn', 'scikit-learn'),
    ('torch', 'PyTorch'),
    ('ee', 'Earth Engine API'),
    ('geemap', 'geemap'),
    ('yaml', 'PyYAML'),
    ('dotenv', 'python-dotenv'),
    ('geopandas', 'GeoPandas'),
    ('shapely', 'Shapely'),
    ('esda', 'ESDA'),
    ('libpysal', 'LibPySAL'),
    ('folium', 'Folium'),
    ('plotly', 'Plotly'),
]

missing = []
installed = []

for module_name, package_name in packages_to_check:
    try:
        __import__(module_name)
        print(f"✅ {package_name}")
        installed.append(package_name)
    except ImportError:
        print(f"❌ {package_name} - NOT INSTALLED")
        missing.append(package_name)

print("\n" + "="*60)
print(f"Summary: {len(installed)}/{len(packages_to_check)} packages installed")
print("="*60)

if missing:
    print(f"\n⚠️  Missing packages ({len(missing)}):")
    for pkg in missing:
        print(f"  - {pkg}")
    print("\nTo install missing packages, run:")
    print("  install_missing.bat")
else:
    print("\n✅ All required packages are installed!")
    print("\nYou can now run:")
    print("  run_demo.bat")

print()

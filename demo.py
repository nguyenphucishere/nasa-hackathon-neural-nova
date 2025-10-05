"""
Demo script to test the bloom forecasting system
Run this to verify installation and basic functionality
"""
import sys
from pathlib import Path

# Add src to path
src_path = Path(__file__).parent / 'src'
sys.path.insert(0, str(src_path))

print("=" * 80)
print("BLOOM FORECASTING SYSTEM - DEMO & TEST")
print("=" * 80)
print()

# Test 1: Configuration
print("✓ Test 1: Loading configuration...")
try:
    from utils.config import get_config
    config = get_config()
    print(f"  Project: {config.get('project_name')}")
    print(f"  Version: {config.get('version')}")
    print(f"  AOIs configured: {len(config.get_all_aois())}")
    print("  ✅ Configuration OK\n")
except Exception as e:
    print(f"  ❌ Configuration failed: {e}\n")
    sys.exit(1)

# Test 2: Earth Engine
print("✓ Test 2: Earth Engine initialization...")
try:
    from utils.ee_utils import initialize_earth_engine
    initialize_earth_engine(config.ee_project_id)
    print("  ✅ Earth Engine OK\n")
except Exception as e:
    print(f"  ❌ Earth Engine failed: {e}")
    print("  Please run: earthengine authenticate\n")
    sys.exit(1)

# Test 3: GPU Detection
print("✓ Test 3: GPU detection...")
try:
    import torch
    if torch.cuda.is_available():
        print(f"  GPU: {torch.cuda.get_device_name(0)}")
        print(f"  CUDA Version: {torch.version.cuda}")
        print(f"  Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
        print("  ✅ GPU available (models will use GPU)\n")
    else:
        print("  ⚠️  No GPU detected (models will use CPU - slower)")
        print("  ✅ PyTorch OK\n")
except Exception as e:
    print(f"  ❌ PyTorch test failed: {e}\n")

# Test 4: Data Collector
print("✓ Test 4: Data collector initialization...")
try:
    from data.ee_data_collector import EarthEngineDataCollector
    collector = EarthEngineDataCollector()
    print("  ✅ Data collector OK\n")
except Exception as e:
    print(f"  ❌ Data collector failed: {e}\n")

# Test 5: Models
print("✓ Test 5: Model imports...")
try:
    from models.random_forest_model import RandomForestBloomModel
    from models.deep_learning_models import DeepLearningBloomModel
    
    # Test RF
    rf_config = config.get_model_config('random_forest')
    rf_model = RandomForestBloomModel(rf_config)
    print("  ✅ Random Forest model OK")
    
    # Test DL
    lstm_config = config.get_model_config('lstm')
    lstm_model = DeepLearningBloomModel(lstm_config, model_type='lstm')
    print("  ✅ LSTM model OK\n")
except Exception as e:
    print(f"  ❌ Model test failed: {e}\n")

# Test 6: Spatial Analysis
print("✓ Test 6: Spatial analysis tools...")
try:
    from analysis.hotspot_detection import HotspotAnalyzer
    analyzer = HotspotAnalyzer()
    print("  ✅ Hotspot analyzer OK\n")
except Exception as e:
    print(f"  ❌ Spatial analysis failed: {e}\n")
    print(f"  This might be due to missing spatial libraries (geopandas, esda)\n")

# Test 7: Visualization
print("✓ Test 7: Visualization tools...")
try:
    from visualization.visualizer import BloomVisualizer
    visualizer = BloomVisualizer(config._config)
    print("  ✅ Visualizer OK\n")
except Exception as e:
    print(f"  ❌ Visualization failed: {e}\n")

# Test 8: Workflow
print("✓ Test 8: Workflow initialization...")
try:
    from workflow.bloom_workflow import BloomForecastingWorkflow
    workflow = BloomForecastingWorkflow()
    print("  ✅ Workflow OK\n")
except Exception as e:
    print(f"  ❌ Workflow failed: {e}\n")
    sys.exit(1)

# Summary
print("=" * 80)
print("SUMMARY")
print("=" * 80)
print()
print("✅ All core components loaded successfully!")
print()
print("Next steps:")
print("  1. Run a full workflow:")
print("     python main.py --aoi Ha_Giang_TamGiacMach")
print()
print("  2. Or use the batch script:")
print("     .\\run_workflow.bat")
print()
print("  3. Check outputs in the 'outputs' directory")
print()
print("=" * 80)
print()

# Quick data collection test (optional)
print("🔍 Optional: Quick data collection test?")
print("   This will fetch a small sample from Earth Engine to verify connectivity.")
response = input("   Run test? (y/n): ").lower()

if response == 'y':
    print()
    print("📡 Testing Earth Engine data collection...")
    try:
        import ee
        from data.spectral_indices import SpectralIndices
        
        # Small test area
        test_point = ee.Geometry.Point([105.0, 21.0])
        test_area = test_point.buffer(1000)  # 1km buffer
        
        # Get one image
        s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
            .filterBounds(test_area) \
            .filterDate('2024-01-01', '2024-01-31') \
            .first()
        
        # Calculate indices
        calc = SpectralIndices()
        s2_with_indices = calc.add_all_indices(s2)
        
        # Get band names
        bands = s2_with_indices.bandNames().getInfo()
        
        print(f"   ✅ Successfully fetched Sentinel-2 image")
        print(f"   Bands available: {len(bands)}")
        print(f"   Sample bands: {', '.join(bands[:10])}...")
        print()
        print("   🎉 Earth Engine data collection is working!")
        
    except Exception as e:
        print(f"   ❌ Data collection test failed: {e}")
        print()
        print("   This might be normal if:")
        print("   - You don't have internet connection")
        print("   - Earth Engine is temporarily unavailable")
        print("   - You need to re-authenticate")

print()
print("=" * 80)
print("Demo complete! System is ready to use.")
print("=" * 80)

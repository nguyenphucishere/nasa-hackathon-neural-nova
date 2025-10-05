"""
Merge Daily GeoJSON Files into Single Timeseries GeoJSON
=========================================================
Gộp 30 files GeoJSON riêng lẻ thành 1 meta file duy nhất    print(f"{'='*80}\n")
    
    return output_path_frontend


def main():nguyên ALL properties và structure
"""

import json
from pathlib import Path
import argparse


def merge_daily_geojson(aoi_name, output_dir=None):
    """
    Gộp 30 daily GeoJSON files thành 1 timeseries file
    
    Args:
        aoi_name: Tên AOI (e.g., 'Ha_Giang_TamGiacMach')
        output_dir: Thư mục output (default: same as daily files)
    
    Returns:
        Path to merged file
    """
    print(f"\n{'='*80}")
    print(f"MERGING DAILY GEOJSON FILES")
    print(f"AOI: {aoi_name}")
    print(f"{'='*80}\n")
    
    # 1. Find all daily files
    base_dir = Path(f'outputs/hotspots/{aoi_name}')
    if not base_dir.exists():
        raise FileNotFoundError(f"Directory not found: {base_dir}")
    
    # Pattern: {AOI}_hotspots_YYYY-MM-DD.geojson
    daily_files = sorted(base_dir.glob(f'{aoi_name}_hotspots_????-??-??.geojson'))
    
    if len(daily_files) == 0:
        raise FileNotFoundError(f"No daily files found in {base_dir}")
    
    print(f"📁 Found {len(daily_files)} daily files")
    print(f"   First: {daily_files[0].name}")
    print(f"   Last:  {daily_files[-1].name}\n")
    
    # 2. Load first file to get CRS template
    with open(daily_files[0], 'r', encoding='utf-8') as f:
        first_data = json.load(f)
    
    # Extract CRS (must preserve exactly)
    crs = first_data.get('crs', {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    })
    
    print(f"📍 CRS: {crs['properties']['name']}\n")
    
    # 3. Collect all features from all files
    all_features = []
    file_stats = []
    
    for i, file_path in enumerate(daily_files, 1):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        features = data.get('features', [])
        num_features = len(features)
        
        # Get date from filename
        date_str = file_path.stem.split('_')[-1]
        
        # Verify each feature has required properties
        for feature in features:
            # Ensure date property exists
            if 'date' not in feature.get('properties', {}):
                feature['properties']['date'] = date_str
            
            # Preserve all original properties
            # (lon, lat, bloom_probability, gi_star_z, gi_star_p, 
            #  gi_star_significant, hotspot_type, cluster_id, is_noise, etc.)
            all_features.append(feature)
        
        file_stats.append({
            'file': file_path.name,
            'date': date_str,
            'features': num_features
        })
        
        print(f"   [{i:2d}/{len(daily_files)}] {date_str}: {num_features:3d} features")
    
    print(f"\n✅ Total features collected: {len(all_features)}")
    
    # 4. Create merged GeoJSON
    merged_geojson = {
        "type": "FeatureCollection",
        "name": f"{aoi_name}_hotspots_timeseries",
        "crs": crs,  # Preserve exact CRS
        "features": all_features  # All features with all properties preserved
    }
    
    # 5. Save merged file to TWO locations
    # 5a. Local backup in outputs folder
    output_path_local = base_dir / f'{aoi_name}_hotspots_timeseries.geojson'
    with open(output_path_local, 'w', encoding='utf-8') as f:
        json.dump(merged_geojson, f, indent=2, ensure_ascii=False)
    
    # 5b. Frontend public folder (main output)
    if output_dir:
        frontend_dir = Path(output_dir)
    else:
        frontend_dir = Path('./web')
    
    frontend_dir.mkdir(parents=True, exist_ok=True)
    output_path_frontend = frontend_dir / f'{aoi_name}_hotspots_timeseries.geojson'
    
    with open(output_path_frontend, 'w', encoding='utf-8') as f:
        json.dump(merged_geojson, f, indent=2, ensure_ascii=False)
    
    # 6. Print summary
    print(f"\n{'='*80}")
    print(f"MERGE COMPLETED!")
    print(f"{'='*80}")
    print(f"📄 Local backup: {output_path_local}")
    print(f"🌐 Frontend output: {output_path_frontend}")
    print(f"📊 Statistics:")
    print(f"   - Total days: {len(daily_files)}")
    print(f"   - Total features: {len(all_features)}")
    print(f"   - Average features/day: {len(all_features)/len(daily_files):.1f}")
    print(f"   - Date range: {file_stats[0]['date']} → {file_stats[-1]['date']}")
    
    # File size (check frontend file)
    file_size = output_path_frontend.stat().st_size
    if file_size > 1024*1024:
        size_str = f"{file_size/(1024*1024):.2f} MB"
    else:
        size_str = f"{file_size/1024:.2f} KB"
    print(f"   - File size: {size_str}")
    
    # 7. Sample feature check (verify properties preserved)
    if len(all_features) > 0:
        sample = all_features[0]
        print(f"\n📋 Sample feature properties:")
        for key, value in sample.get('properties', {}).items():
            print(f"   - {key}: {value}")
    
    print(f"\n{'='*80}\n")
    
    # 8. Delete daily files after successful merge
    print(f"🗑️  CLEANING UP DAILY FILES...")
    print(f"{'='*80}")
    
    deleted_count = 0
    failed_files = []
    
    for file_path in daily_files:
        try:
            file_path.unlink()  # Delete file
            deleted_count += 1
            print(f"   ✅ Deleted: {file_path.name}")
        except Exception as e:
            failed_files.append((file_path.name, str(e)))
            print(f"   ❌ Failed to delete {file_path.name}: {e}")
    
    print(f"\n{'='*80}")
    print(f"CLEANUP SUMMARY")
    print(f"{'='*80}")
    print(f"✅ Deleted: {deleted_count}/{len(daily_files)} daily files")
    
    if failed_files:
        print(f"⚠️  Failed: {len(failed_files)} files")
        for fname, error in failed_files:
            print(f"   - {fname}: {error}")
    
    print(f"\n📁 Remaining files in {base_dir}:")
    remaining = list(base_dir.glob('*.geojson'))
    for f in remaining:
        print(f"   - {f.name}")
    
    print(f"\n{'='*80}\n")
    
    return output_path_frontend  # Return frontend path


def main():
    parser = argparse.ArgumentParser(description='Merge daily GeoJSON files into single timeseries file')
    parser.add_argument('--aoi', type=str, required=True,
                        help='AOI name (e.g., Ha_Giang_TamGiacMach)')
    parser.add_argument('--output-dir', type=str, default=None,
                        help='Output directory (default: same as input)')
    
    args = parser.parse_args()
    
    try:
        output_path = merge_daily_geojson(args.aoi, args.output_dir)
        print(f"✅ SUCCESS! Merged file: {output_path}")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0


if __name__ == '__main__':
    exit(main())

"""
Analyze and visualize 30-day time-series bloom forecasts
Works with individual daily GeoJSON files
"""
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from datetime import datetime, timedelta
import argparse
from glob import glob

sns.set_style('whitegrid')


def load_daily_geojson_files(input_dir):
    """
    Load all daily GeoJSON files from directory
    
    Args:
        input_dir: Directory containing daily GeoJSON files
        
    Returns:
        Dictionary mapping date_str → features list
    """
    input_path = Path(input_dir)
    
    # Find all daily GeoJSON files (pattern: *_hotspots_YYYY-MM-DD.geojson)
    geojson_files = sorted(input_path.glob('*_hotspots_????-??-??.geojson'))
    
    if not geojson_files:
        raise FileNotFoundError(f"No daily GeoJSON files found in {input_dir}")
    
    print(f"\n📂 Found {len(geojson_files)} daily GeoJSON files")
    
    daily_data = {}
    
    for geojson_file in geojson_files:
        # Extract date from filename
        # Format: AOI_hotspots_YYYY-MM-DD.geojson
        filename = geojson_file.stem
        date_str = filename.split('_')[-1]  # Get last part (YYYY-MM-DD)
        
        # Load GeoJSON
        with open(geojson_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        daily_data[date_str] = data['features']
        print(f"   ✅ {date_str}: {len(data['features'])} hotspots")
    
    return daily_data


def extract_daily_stats(daily_data):
    """Extract daily statistics from daily GeoJSON data"""
    daily_stats = []
    
    for date_str, features in sorted(daily_data.items()):
        if len(features) > 0:
            probs = [f['properties']['bloom_probability'] for f in features]
            stats = {
                'date': pd.to_datetime(date_str),
                'total_hotspots': len(features),
                'mean_score': np.mean(probs),
                'max_score': np.max(probs),
                'min_score': np.min(probs),
                'std_score': np.std(probs)
            }
        else:
            stats = {
                'date': pd.to_datetime(date_str),
                'total_hotspots': 0,
                'mean_score': 0,
                'max_score': 0,
                'min_score': 0,
                'std_score': 0
            }
        daily_stats.append(stats)
    
    df = pd.DataFrame(daily_stats).sort_values('date')
    return df


def plot_daily_trends(df, aoi_name, save_path):
    """Plot daily trends of bloom conditions"""
    fig, axes = plt.subplots(2, 1, figsize=(14, 10))
    
    # Plot 1: Mean/Max scores over time
    ax1 = axes[0]
    ax1.plot(df['date'], df['mean_score'], 
             marker='o', linewidth=2, markersize=6,
             label='Mean Condition Score', color='steelblue')
    ax1.plot(df['date'], df['max_score'], 
             marker='s', linewidth=2, markersize=5, alpha=0.7,
             label='Max Condition Score', color='coral')
    ax1.axhline(y=0.7, color='green', linestyle='--', alpha=0.5, 
                label='Good Threshold (0.7)')
    ax1.axhline(y=0.5, color='orange', linestyle='--', alpha=0.5,
                label='Moderate Threshold (0.5)')
    
    ax1.set_xlabel('Date', fontsize=12)
    ax1.set_ylabel('Condition Score', fontsize=12)
    ax1.set_title(f'{aoi_name} - 30-Day Bloom Condition Forecast', 
                  fontsize=14, fontweight='bold')
    ax1.legend(loc='best', fontsize=10)
    ax1.grid(True, alpha=0.3)
    ax1.set_ylim([0, 1])
    
    # Plot 2: Number of hotspots
    ax2 = axes[1]
    ax2.bar(df['date'], df['total_hotspots'], 
            color='forestgreen', alpha=0.6, edgecolor='darkgreen')
    ax2.set_xlabel('Date', fontsize=12)
    ax2.set_ylabel('Number of Hotspots', fontsize=12)
    ax2.set_title('Daily Hotspot Count (Top N per day)', 
                  fontsize=12, fontweight='bold')
    ax2.grid(True, alpha=0.3, axis='y')
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"✅ Saved daily trends plot: {save_path}")
    plt.close()


def detect_peak_period(df, threshold=0.7):
    """Detect peak bloom period"""
    peak_days = df[df['mean_score'] >= threshold]
    
    if len(peak_days) == 0:
        return None, None, f"No days with mean score >= {threshold}"
    
    peak_start = peak_days['date'].min()
    peak_end = peak_days['date'].max()
    peak_duration = (peak_end - peak_start).days + 1
    
    return peak_start, peak_end, peak_duration


def generate_summary_report(df, aoi_name, date_range, output_path):
    """Generate text summary report"""
    
    report = []
    report.append("=" * 80)
    report.append(f"30-DAY BLOOM CONDITION FORECAST SUMMARY")
    report.append(f"AOI: {aoi_name}")
    report.append(f"Date Range: {date_range['start']} → {date_range['end']}")
    report.append("=" * 80)
    report.append("")
    
    # Overall statistics
    report.append("📊 OVERALL STATISTICS")
    report.append("-" * 80)
    report.append(f"Total days analyzed: {len(df)}")
    report.append(f"Average condition score: {df['mean_score'].mean():.3f}")
    report.append(f"Peak condition score: {df['max_score'].max():.3f}")
    report.append(f"Best day: {df.loc[df['max_score'].idxmax(), 'date'].strftime('%Y-%m-%d')}")
    report.append("")
    
    # Peak period detection
    report.append("🔥 PEAK PERIOD ANALYSIS")
    report.append("-" * 80)
    
    for threshold in [0.8, 0.7, 0.6]:
        peak_start, peak_end, duration = detect_peak_period(df, threshold)
        if peak_start:
            report.append(f"Threshold {threshold}: {peak_start.strftime('%Y-%m-%d')} → "
                         f"{peak_end.strftime('%Y-%m-%d')} ({duration} days)")
        else:
            report.append(f"Threshold {threshold}: {duration}")
    report.append("")
    
    # Weekly breakdown
    report.append("📅 WEEKLY BREAKDOWN")
    report.append("-" * 80)
    
    df['week'] = ((df['date'] - df['date'].min()).dt.days // 7) + 1
    weekly_stats = df.groupby('week').agg({
        'mean_score': 'mean',
        'max_score': 'max',
        'total_hotspots': 'sum'
    }).round(3)
    
    for week, stats in weekly_stats.iterrows():
        week_start = df[df['week'] == week]['date'].min()
        week_end = df[df['week'] == week]['date'].max()
        report.append(f"Week {int(week)} ({week_start.strftime('%m/%d')} - {week_end.strftime('%m/%d')}): "
                     f"Mean={stats['mean_score']:.3f}, Max={stats['max_score']:.3f}, "
                     f"Hotspots={int(stats['total_hotspots'])}")
    report.append("")
    
    # Recommendations
    report.append("💡 RECOMMENDATIONS")
    report.append("-" * 80)
    
    best_week = weekly_stats['mean_score'].idxmax()
    best_week_start = df[df['week'] == best_week]['date'].min()
    best_week_end = df[df['week'] == best_week]['date'].max()
    
    report.append(f"🌟 Best week for visiting: Week {int(best_week)} "
                 f"({best_week_start.strftime('%Y-%m-%d')} - {best_week_end.strftime('%Y-%m-%d')})")
    report.append(f"   Average condition score: {weekly_stats.loc[best_week, 'mean_score']:.3f}")
    
    # Top 3 days
    report.append("")
    report.append("🎯 TOP 3 DAYS:")
    top_days = df.nlargest(3, 'mean_score')
    for i, (idx, row) in enumerate(top_days.iterrows(), 1):
        report.append(f"   {i}. {row['date'].strftime('%Y-%m-%d')}: "
                     f"Mean={row['mean_score']:.3f}, Max={row['max_score']:.3f}")
    
    report.append("")
    report.append("=" * 80)
    
    # Save report
    report_text = "\n".join(report)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(report_text)
    
    print(f"✅ Saved summary report: {output_path}")
    print("\n" + report_text)


def plot_heatmap_calendar(df, aoi_name, save_path):
    """Create calendar heatmap of condition scores"""
    # Prepare data for heatmap
    df['day_of_month'] = df['date'].dt.day
    df['week_of_forecast'] = ((df['date'] - df['date'].min()).dt.days // 7) + 1
    
    # Create pivot table
    pivot = df.pivot_table(
        values='mean_score',
        index='week_of_forecast',
        columns='day_of_month',
        fill_value=np.nan
    )
    
    # Plot
    fig, ax = plt.subplots(figsize=(16, 6))
    sns.heatmap(pivot, annot=True, fmt='.2f', cmap='RdYlGn', 
                vmin=0, vmax=1, cbar_kws={'label': 'Condition Score'},
                linewidths=1, linecolor='white', ax=ax)
    
    ax.set_xlabel('Day of Month', fontsize=12)
    ax.set_ylabel('Week of Forecast', fontsize=12)
    ax.set_title(f'{aoi_name} - Bloom Condition Calendar Heatmap', 
                 fontsize=14, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"✅ Saved calendar heatmap: {save_path}")
    plt.close()


def main():
    parser = argparse.ArgumentParser(description='Analyze 30-day bloom forecast')
    parser.add_argument('--input', type=str, required=True,
                       help='Path to directory containing daily GeoJSON files OR path to metadata JSON')
    parser.add_argument('--output-dir', type=str, default='outputs/analysis',
                       help='Output directory for analysis results')
    
    args = parser.parse_args()
    
    input_path = Path(args.input)
    
    # Determine input type
    if input_path.is_dir():
        # Directory containing daily GeoJSON files
        print(f"\n📂 Loading daily GeoJSON files from: {input_path}")
        daily_data = load_daily_geojson_files(input_path)
        
        # Extract AOI name from directory name or first file
        aoi_name = input_path.name
        
        # Get date range
        dates = sorted(daily_data.keys())
        date_range = {
            'start': dates[0],
            'end': dates[-1]
        }
        
    elif input_path.suffix == '.json' and 'metadata' in input_path.name:
        # Metadata JSON file
        print(f"\n📂 Loading from metadata: {input_path}")
        with open(input_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
        
        aoi_name = metadata['aoi_name']
        date_range = metadata['date_range']
        
        # Load daily files from same directory
        daily_data = load_daily_geojson_files(input_path.parent)
    else:
        raise ValueError("Input must be a directory or metadata JSON file")
    
    print(f"🌸 AOI: {aoi_name}")
    print(f"📅 Date range: {date_range['start']} → {date_range['end']}")
    
    # Extract daily statistics
    print(f"\n📊 Extracting daily statistics...")
    df = extract_daily_stats(daily_data)
    
    # Create output directory
    output_dir = Path(args.output_dir) / aoi_name
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate plots
    print(f"\n📈 Generating visualizations...")
    
    # Daily trends
    plot_daily_trends(df, aoi_name, output_dir / f'{aoi_name}_daily_trends.png')
    
    # Calendar heatmap
    plot_heatmap_calendar(df, aoi_name, output_dir / f'{aoi_name}_calendar_heatmap.png')
    
    # Summary report
    print(f"\n📝 Generating summary report...")
    generate_summary_report(df, aoi_name, date_range, output_dir / f'{aoi_name}_summary_report.txt')
    
    # Export daily stats CSV
    csv_path = output_dir / f'{aoi_name}_daily_stats.csv'
    df.to_csv(csv_path, index=False)
    print(f"✅ Saved daily statistics: {csv_path}")
    
    print(f"\n✅ Analysis complete! Results saved to: {output_dir}")


if __name__ == '__main__':
    main()

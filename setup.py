"""Setup script for Bloom Forecasting System"""
from setuptools import setup, find_packages
from pathlib import Path

# Read README
readme_file = Path(__file__).parent / "README.md"
long_description = readme_file.read_text(encoding='utf-8') if readme_file.exists() else ""

# Read requirements
requirements_file = Path(__file__).parent / "requirements.txt"
if requirements_file.exists():
    with open(requirements_file, 'r', encoding='utf-8') as f:
        requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]
else:
    requirements = []

setup(
    name="bloom-forecasting",
    version="1.0.0",
    author="Bloom Forecasting Research Team",
    description="Hyperspectral bloom forecasting using Google Earth Engine and Deep Learning",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/bloom-forecasting",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Science/Research",
        "Topic :: Scientific/Engineering :: GIS",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.10",
    install_requires=requirements,
    entry_points={
        'console_scripts': [
            'bloom-forecast=workflow.bloom_workflow:main',
        ],
    },
    include_package_data=True,
    package_data={
        '': ['*.yaml', '*.yml'],
    },
)

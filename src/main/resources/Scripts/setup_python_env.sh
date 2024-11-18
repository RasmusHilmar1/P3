#!/bin/bash
echo "Setting up Python environment..."

# Check if venv folder exists in the root directory; if not, create it
if [ ! -d "../../../venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv ../../../venv
else
    echo "Virtual environment already exists."
fi

# Activate the virtual environment
source ../../../venv/bin/activate

# Install dependencies from requirements.txt in the Scripts folder
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Python environment setup complete."

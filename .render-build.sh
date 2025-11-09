
set -o errexit
export PIP_ONLY_BINARY=:all:
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt


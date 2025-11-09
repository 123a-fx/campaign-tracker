
export PIP_ONLY_BINARY=:all:
#!/usr/bin/env bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

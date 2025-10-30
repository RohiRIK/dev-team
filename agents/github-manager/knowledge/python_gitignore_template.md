# Python .gitignore Template

This document provides a .gitignore file content specifically tailored for Python projects.

```
# Byte-compiled / optimized / DLL files
__pycache__/
*.pyc
*.pyd
*.pyo
*.egg-info/
.Python

# C extensions
*.so

# Distribution / packaging
.Python
build/
dist/
*.egg
*.whl

# Installer logs
*.log

# Unit test / coverage reports
.coverage
.pytest_cache/
htmlcov/
.tox/

# Virtual environment
virtualenv/
venv/
env/
.venv/

# Editors
.vscode/
.idea/
*~
*.swp

# OS generated files
.DS_Store
Thumbs.db

# Environment variables
.env
.flaskenv

# Jupyter Notebook files
.ipynb_checkpoints

# MyPy
.mypy_cache/

# Pyright
.pyright/

# Ruff
.ruff_cache/

# Black
.black_cache/

# Bandit
.bandit/

# Pylint
.pylint.d/

# Pipenv
Pipfile.lock

# Poetry
poetry.lock

# Conda
.conda/
.condarc

# Docker
Dockerfile.bak
Dockerfile.old

# Misc
*.bak
*.tmp
```
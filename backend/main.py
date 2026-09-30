"""
Vercel & Root Entrypoint for FastAPI Application
"""
import sys
from pathlib import Path

# Ensure backend directory and project root are both in sys.path
backend_dir = Path(__file__).resolve().parent
project_root = backend_dir.parent

for path_dir in [str(backend_dir), str(project_root)]:
    if path_dir not in sys.path:
        sys.path.insert(0, path_dir)

# Import the FastAPI ASGI app instance
from backend.app.main import app

__all__ = ["app"]

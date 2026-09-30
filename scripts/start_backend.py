import uvicorn
import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

if __name__ == "__main__":
    print("[Anvaya] Starting National Land Governance Backend API server on http://127.0.0.1:8000...")
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)

import os
from pathlib import Path
from dotenv import load_dotenv

# Find .env file
root_dir = Path(__file__).resolve().parent.parent.parent
env_path = root_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

is_vercel = bool(os.getenv("VERCEL"))
default_db = "sqlite:////tmp/landgov.db" if is_vercel else "sqlite:///./landgov.db"

class Settings:
    PROJECT_NAME: str = "LandGov AI — National Land Governance Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", default_db)
    JWT_SECRET: str = os.getenv("JWT_SECRET", "national-land-governance-ai-platform-secret-key-2026")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production" if is_vercel else "development")
    
    UPLOAD_DIR: Path = Path("/tmp/uploads") if is_vercel else (root_dir / "uploads")
    DATA_DIR: Path = (root_dir / "data") if (root_dir / "data").exists() else Path("/tmp/data")
    
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
try:
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
except Exception:
    pass

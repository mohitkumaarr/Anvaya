#!/bin/sh
set -e

echo "=========================================================="
echo " Starting LandGov AI — National Land Governance Platform   "
echo "=========================================================="

# Check and wait for database if PostgreSQL is used
if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -q "postgres"; then
    echo "[Entrypoint] PostgreSQL database detected. Waiting for DB connection..."
    python -c '
import sys, time, os
from sqlalchemy import create_engine

db_url = os.getenv("DATABASE_URL")
max_tries = 30
for i in range(max_tries):
    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            print("[Entrypoint] Database is ready!")
            sys.exit(0)
    except Exception as e:
        print(f"[Entrypoint] Waiting for DB... ({i+1}/{max_tries}): {e}")
        time.sleep(2)
sys.exit(1)
'
fi

# Seed database if requested or if database is empty
if [ "$SEED_ON_START" = "true" ] || [ "$SEED_ON_START" = "1" ]; then
    echo "[Entrypoint] SEED_ON_START is enabled. Seeding platform demonstration data..."
    python backend/seed.py || echo "[Entrypoint] Warning: Seeding step completed or encountered non-fatal notice."
else
    echo "[Entrypoint] Checking if database needs initial seeding..."
    python -c '
import os, sys
from backend.app.database import SessionLocal, engine, Base
from backend.app import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    user_count = db.query(models.User).count()
    if user_count == 0:
        print("[Entrypoint] Empty database detected. Running seed script...")
        import subprocess
        subprocess.run(["python", "backend/seed.py"], check=True)
    else:
        print(f"[Entrypoint] Database contains {user_count} users. Skipping seed.")
finally:
    db.close()
' || echo "[Entrypoint] Initial check completed."
fi

WORKERS=${WORKERS:-4}
PORT=${PORT:-8000}

echo "[Entrypoint] Starting production server on port ${PORT} with ${WORKERS} Uvicorn workers..."
exec gunicorn -w "$WORKERS" -k uvicorn.workers.UvicornWorker backend.app.main:app --bind "0.0.0.0:${PORT}" --timeout 180 --access-logfile - --error-logfile -

import os
import sys
from pathlib import Path

# Add project root and backend directory to sys.path for Vercel, Docker, and local execution
_current_dir = Path(__file__).resolve().parent
_backend_dir = _current_dir.parent
_project_root = _backend_dir.parent

for p in [str(_project_root), str(_backend_dir)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.routers import (
    auth,
    documents,
    research,
    datasets,
    regions,
    gis,
    search,
    research_gaps,
    policy_lab,
    evidence_graph,
    policy_briefs,
    policies,
    projects,
    admin,
    analytics,
    innovation,
    notifications
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="National Digital Infrastructure Platform for Evidence-Based Land Governance and Policy Innovation in India.",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url="/api/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files for Uploads
if settings.UPLOAD_DIR.exists():
    app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

# Mount Routers
app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(research.router)
app.include_router(datasets.router)
app.include_router(regions.router)
app.include_router(gis.router)
app.include_router(search.router)
app.include_router(research_gaps.router)
app.include_router(policy_lab.router)
app.include_router(evidence_graph.router)
app.include_router(policy_briefs.router)
app.include_router(policies.router)
app.include_router(projects.router)
app.include_router(admin.router)
app.include_router(analytics.router)
app.include_router(innovation.router)
app.include_router(notifications.router)

@app.get("/")
@app.get("/api")
@app.get("/api/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "demo_mode": settings.DEMO_MODE,
        "environment": settings.ENVIRONMENT,
        "documentation": "/api/docs"
    }

@app.get("/docs", include_in_schema=False)
def docs_redirect():
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/api/docs")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": os.times()[4],
        "database": "connected",
        "demo_mode": settings.DEMO_MODE
    }

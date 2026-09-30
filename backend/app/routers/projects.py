from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user, RequireRole

router = APIRouter(prefix="/api/projects", tags=["Collaborative Research Workspace"])

@router.get("/", response_model=List[schemas.ResearchProjectOut])
def list_projects(db: Session = Depends(get_db)):
    return db.query(models.ResearchProject).order_by(models.ResearchProject.id.desc()).all()

@router.get("/{project_id}", response_model=schemas.ResearchProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    proj = db.query(models.ResearchProject).filter(models.ResearchProject.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.post("/", response_model=schemas.ResearchProjectOut)
def create_project(
    project_in: schemas.ResearchProjectCreate,
    current_user: models.User = Depends(RequireRole(["RESEARCHER", "POLICYMAKER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    project = models.ResearchProject(
        title=project_in.title,
        description=project_in.description,
        lead_researcher_id=current_user.id,
        lead_name=current_user.full_name,
        members=[{"name": current_user.full_name, "role": "Principal Investigator", "institution": current_user.organization}],
        status="ACTIVE",
        topic=project_in.topic,
        region=project_in.region,
        research_questions=project_in.research_questions or [
            "What spatial incentives most effectively prevent fragmented farmland conversion?",
            "How can village abadi records interface with state GIS portals?"
        ],
        tasks=[
            {"id": 1, "title": "Field baseline validation of cadastral anomalies", "status": "IN_PROGRESS", "assignee": current_user.full_name},
            {"id": 2, "title": "Synthesize state-level land acquisition compensation datasets", "status": "TODO", "assignee": "Research Team"},
            {"id": 3, "title": "Model ecological buffer scenarios in Policy Lab", "status": "TODO", "assignee": "Principal Investigator"}
        ],
        comments=[
            {"author": current_user.full_name, "date": "2026-09-30", "text": "Research workspace initialized. Data connections established."}
        ],
        findings=[
            "Spatial audits indicate critical need for statutory green buffers along suburban corridors."
        ],
        policy_outputs=[
            "Targeted Ministerial Policy Brief for Regional Development Authority."
        ],
        document_ids=project_in.document_ids or [1, 2],
        dataset_ids=project_in.dataset_ids or [1]
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    notif = models.Notification(
        user_id=current_user.id,
        title="Research Project Initialized",
        message=f"Project '{project.title}' is active in the collaborative workspace.",
        type="PROJECT",
        link=f"/projects"
    )
    db.add(notif)
    db.commit()

    return project

@router.post("/{project_id}/tasks")
def add_or_update_task(project_id: int, task: Dict[str, Any], db: Session = Depends(get_db)):
    proj = db.query(models.ResearchProject).filter(models.ResearchProject.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
        
    tasks = list(proj.tasks or [])
    task_id = task.get("id")
    if task_id:
        # Update existing
        for t in tasks:
            if t.get("id") == task_id:
                t.update(task)
                break
    else:
        # Append new
        new_id = len(tasks) + 1
        task["id"] = new_id
        tasks.append(task)
        
    proj.tasks = tasks
    db.commit()
    return {"status": "success", "tasks": tasks}

@router.post("/{project_id}/comments")
def add_comment(project_id: int, comment_data: Dict[str, str], current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    proj = db.query(models.ResearchProject).filter(models.ResearchProject.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
        
    comments = list(proj.comments or [])
    comments.append({
        "author": current_user.full_name,
        "date": "2026-09-30",
        "text": comment_data.get("text", "")
    })
    proj.comments = comments
    db.commit()
    return {"status": "success", "comments": comments}

@router.post("/{project_id}/attach-document")
def attach_document(project_id: int, doc_id: int, db: Session = Depends(get_db)):
    proj = db.query(models.ResearchProject).filter(models.ResearchProject.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
        
    doc_ids = list(proj.document_ids or [])
    if doc_id not in doc_ids:
        doc_ids.append(doc_id)
        proj.document_ids = doc_ids
        db.commit()
    return {"status": "success", "document_ids": proj.document_ids}

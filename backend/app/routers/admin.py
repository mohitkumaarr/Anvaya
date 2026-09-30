from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import RequireRole

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"], dependencies=[Depends(RequireRole(["ADMIN"]))])

@router.get("/overview")
def get_admin_overview(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    total_docs = db.query(models.Document).count()
    pending_docs = db.query(models.Document).filter(models.Document.status == "PENDING_REVIEW").count()
    total_datasets = db.query(models.Dataset).count()
    total_projects = db.query(models.ResearchProject).count()
    total_scenarios = db.query(models.PolicyScenario).count()
    
    return {
        "total_users": total_users,
        "total_documents": total_docs,
        "pending_documents": pending_docs,
        "total_datasets": total_datasets,
        "total_projects": total_projects,
        "total_scenarios": total_scenarios,
        "system_status": "OPERATIONAL",
        "database_engine": db.bind.dialect.name,
        "ai_synthesis_mode": "ACTIVE (Hybrid Local/API)"
    }

@router.get("/users", response_model=List[schemas.UserOut])
def list_all_users(db: Session = Depends(get_db)):
    return db.query(models.User).order_by(models.User.id.asc()).all()

@router.put("/users/{user_id}/role")
def update_user_role(user_id: int, role: str, db: Session = Depends(get_db)):
    role = role.upper()
    if role not in ["PUBLIC", "RESEARCHER", "POLICYMAKER", "ADMIN"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    return {"status": "success", "user_id": user.id, "new_role": user.role}

@router.get("/documents/pending", response_model=List[schemas.DocumentOut])
def list_pending_documents(db: Session = Depends(get_db)):
    return db.query(models.Document).filter(models.Document.status == "PENDING_REVIEW").all()

@router.put("/documents/{doc_id}/moderate")
def moderate_document(doc_id: int, action: str = Query(..., regex="^(APPROVE|REJECT)$"), db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    doc.status = "APPROVED" if action == "APPROVE" else "REJECTED"
    db.commit()

    if doc.uploader_id:
        notif = models.Notification(
            user_id=doc.uploader_id,
            title="Document Review Decision",
            message=f"Your submitted document '{doc.title}' has been {doc.status.lower()} by the National Editorial Board.",
            type="DOCUMENT",
            link="/repository"
        )
        db.add(notif)
        db.commit()

    return {"status": "success", "doc_id": doc.id, "new_status": doc.status}

@router.delete("/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"status": "success", "deleted_id": doc_id}

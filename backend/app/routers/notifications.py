from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("/", response_model=List[schemas.NotificationOut])
def get_user_notifications(db: Session = Depends(get_db)):
    return db.query(models.Notification).order_by(models.Notification.id.desc()).limit(20).all()

@router.put("/{notif_id}/read")
def mark_notification_read(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if notif:
        notif.read = True
        db.commit()
    return {"status": "success", "id": notif_id}

@router.post("/mark-all-read")
def mark_all_notifications_read(db: Session = Depends(get_db)):
    db.query(models.Notification).update({models.Notification.read: True})
    db.commit()
    return {"status": "success"}

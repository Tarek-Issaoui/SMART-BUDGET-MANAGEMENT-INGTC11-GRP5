from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.controllers import alerte_controller as ctrl
from app import schemas

router = APIRouter(prefix="/alertes", tags=["Alertes"])

@router.get("/", response_model=list[schemas.AlerteRead])
def get_all(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_all(db, current_user.id)

@router.patch("/{alerte_id}/lu", response_model=schemas.AlerteRead)
def mark_as_read(alerte_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.mark_as_read(db, alerte_id, current_user.id)

@router.delete("/{alerte_id}", status_code=204)
def delete(alerte_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    ctrl.delete(db, alerte_id, current_user.id)

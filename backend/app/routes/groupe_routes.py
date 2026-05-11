from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.controllers import groupe_controller as ctrl
from app import schemas

router = APIRouter(prefix="/groupes", tags=["Groupes"])

@router.post("/", response_model=schemas.GroupeRead)
def create(data: schemas.GroupeCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.create(db, data, current_user.id)

@router.get("/", response_model=list[schemas.GroupeRead])
def get_all(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_all(db)

@router.get("/{groupe_id}", response_model=schemas.GroupeRead)
def get_one(groupe_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_by_id(db, groupe_id)

@router.delete("/{groupe_id}", status_code=204)
def delete(groupe_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    ctrl.delete(db, groupe_id)

@router.post("/{groupe_id}/membres", response_model=schemas.MembreGroupeRead)
def add_membre(groupe_id: int, data: schemas.MembreGroupeCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.add_membre(db, groupe_id, data)

@router.get("/{groupe_id}/membres", response_model=list[schemas.MembreGroupeRead])
def get_membres(groupe_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_membres(db, groupe_id)

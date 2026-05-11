from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.controllers import categorie_controller as ctrl
from app import schemas

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", response_model=schemas.CategorieRead)
def create(data: schemas.CategorieCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.create(db, data, current_user.id)

@router.get("/", response_model=list[schemas.CategorieRead])
def get_all(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_all(db, current_user.id)

@router.get("/{categorie_id}", response_model=schemas.CategorieRead)
def get_one(categorie_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_by_id(db, categorie_id)

@router.delete("/{categorie_id}", status_code=204)
def delete(categorie_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    ctrl.delete(db, categorie_id)

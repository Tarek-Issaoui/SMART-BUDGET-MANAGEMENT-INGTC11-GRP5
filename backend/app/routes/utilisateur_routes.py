from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.controllers import utilisateur_controller as ctrl
from app import schemas

router = APIRouter(tags=["Utilisateurs"])

@router.post("/auth/register", response_model=schemas.UtilisateurRead)
def register(data: schemas.UtilisateurCreate, db: Session = Depends(get_db)):
    return ctrl.register(db, data)

@router.post("/auth/login", response_model=schemas.Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return ctrl.login(db, form)

@router.get("/utilisateurs/me", response_model=schemas.UtilisateurRead)
def me(current_user=Depends(get_current_user)):
    return current_user

@router.get("/utilisateurs", response_model=list[schemas.UtilisateurRead])
def get_all(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_all(db)

@router.get("/utilisateurs/{user_id}", response_model=schemas.UtilisateurRead)
def get_one(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_by_id(db, user_id)

@router.delete("/utilisateurs/{user_id}", status_code=204)
def delete(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    ctrl.delete(db, user_id)

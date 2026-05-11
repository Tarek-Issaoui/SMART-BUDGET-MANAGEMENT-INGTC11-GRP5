from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.controllers import budget_controller as ctrl
from app import schemas

router = APIRouter(prefix="/budgets", tags=["Budgets"])

@router.post("/", response_model=schemas.BudgetRead)
def create(data: schemas.BudgetCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.create(db, data, current_user.id)

@router.get("/", response_model=list[schemas.BudgetRead])
def get_all(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_all(db, current_user.id)

@router.get("/{budget_id}", response_model=schemas.BudgetRead)
def get_one(budget_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_by_id(db, budget_id)

@router.put("/{budget_id}", response_model=schemas.BudgetRead)
def update(budget_id: int, data: schemas.BudgetCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.update(db, budget_id, data, current_user.id)

@router.delete("/{budget_id}", status_code=204)
def delete(budget_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    ctrl.delete(db, budget_id, current_user.id)

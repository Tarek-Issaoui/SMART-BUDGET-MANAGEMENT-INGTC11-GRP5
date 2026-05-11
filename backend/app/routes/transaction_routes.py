from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.controllers import transaction_controller as ctrl
from app import schemas

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/", response_model=schemas.TransactionRead)
def create(data: schemas.TransactionCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.create(db, data, current_user.id)

@router.get("/", response_model=list[schemas.TransactionRead])
def get_all(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_all(db, current_user.id)

@router.get("/{transaction_id}", response_model=schemas.TransactionRead)
def get_one(transaction_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ctrl.get_by_id(db, transaction_id)

@router.delete("/{transaction_id}", status_code=204)
def delete(transaction_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    ctrl.delete(db, transaction_id, current_user.id)

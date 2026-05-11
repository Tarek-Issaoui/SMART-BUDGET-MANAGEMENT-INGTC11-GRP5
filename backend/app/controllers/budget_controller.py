from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Budget
from app import schemas


def create(db: Session, data: schemas.BudgetCreate, user_id: int):
    budget = Budget(**data.model_dump(), utilisateur_id=user_id)
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


def get_all(db: Session, user_id: int):
    return db.query(Budget).filter(Budget.utilisateur_id == user_id).all()


def get_by_id(db: Session, budget_id: int):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget introuvable")
    return budget


def update(db: Session, budget_id: int, data: schemas.BudgetCreate, user_id: int):
    budget = get_by_id(db, budget_id)
    if budget.utilisateur_id != user_id:
        raise HTTPException(status_code=403, detail="Non autorisé")
    for key, value in data.model_dump().items():
        setattr(budget, key, value)
    db.commit()
    db.refresh(budget)
    return budget


def delete(db: Session, budget_id: int, user_id: int):
    budget = get_by_id(db, budget_id)
    if budget.utilisateur_id != user_id:
        raise HTTPException(status_code=403, detail="Non autorisé")
    db.delete(budget)
    db.commit()

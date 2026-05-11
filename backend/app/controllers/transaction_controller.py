from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.models import Transaction, Budget, Alerte
from app import schemas


def _check_budget_alert(db: Session, budget_id: int, user_id: int):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        return
    total = db.query(func.sum(Transaction.montant)).filter(
        Transaction.budget_id == budget_id,
        Transaction.type == "depense"
    ).scalar() or 0
    if total >= float(budget.montant):
        alerte = Alerte(
            budget_id=budget_id,
            utilisateur_id=user_id,
            message=f"Budget '{budget.nom}' dépassé : {total} / {budget.montant}"
        )
        db.add(alerte)
        db.commit()


def create(db: Session, data: schemas.TransactionCreate, user_id: int):
    transaction = Transaction(**data.model_dump(), utilisateur_id=user_id)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    if data.budget_id and data.type == "depense":
        _check_budget_alert(db, data.budget_id, user_id)
    return transaction


def get_all(db: Session, user_id: int):
    return db.query(Transaction).filter(Transaction.utilisateur_id == user_id).all()


def get_by_id(db: Session, transaction_id: int):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction introuvable")
    return transaction


def delete(db: Session, transaction_id: int, user_id: int):
    transaction = get_by_id(db, transaction_id)
    if transaction.utilisateur_id != user_id:
        raise HTTPException(status_code=403, detail="Non autorisé")
    db.delete(transaction)
    db.commit()

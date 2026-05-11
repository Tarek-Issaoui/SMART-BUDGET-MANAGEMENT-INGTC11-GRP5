from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Alerte


def get_all(db: Session, user_id: int):
    return db.query(Alerte).filter(Alerte.utilisateur_id == user_id).all()


def mark_as_read(db: Session, alerte_id: int, user_id: int):
    alerte = db.query(Alerte).filter(Alerte.id == alerte_id).first()
    if not alerte:
        raise HTTPException(status_code=404, detail="Alerte introuvable")
    if alerte.utilisateur_id != user_id:
        raise HTTPException(status_code=403, detail="Non autorisé")
    alerte.est_lu = True
    db.commit()
    db.refresh(alerte)
    return alerte


def delete(db: Session, alerte_id: int, user_id: int):
    alerte = db.query(Alerte).filter(Alerte.id == alerte_id).first()
    if not alerte:
        raise HTTPException(status_code=404, detail="Alerte introuvable")
    if alerte.utilisateur_id != user_id:
        raise HTTPException(status_code=403, detail="Non autorisé")
    db.delete(alerte)
    db.commit()

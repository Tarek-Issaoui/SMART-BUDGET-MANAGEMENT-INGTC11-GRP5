from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Groupe, MembreGroupe
from app import schemas


def create(db: Session, data: schemas.GroupeCreate, user_id: int):
    groupe = Groupe(nom=data.nom, cree_par=user_id)
    db.add(groupe)
    db.commit()
    db.refresh(groupe)
    membre = MembreGroupe(groupe_id=groupe.id, utilisateur_id=user_id, role="proprietaire")
    db.add(membre)
    db.commit()
    return groupe


def get_all(db: Session):
    return db.query(Groupe).all()


def get_by_id(db: Session, groupe_id: int):
    groupe = db.query(Groupe).filter(Groupe.id == groupe_id).first()
    if not groupe:
        raise HTTPException(status_code=404, detail="Groupe introuvable")
    return groupe


def delete(db: Session, groupe_id: int):
    groupe = get_by_id(db, groupe_id)
    db.delete(groupe)
    db.commit()


def add_membre(db: Session, groupe_id: int, data: schemas.MembreGroupeCreate):
    get_by_id(db, groupe_id)
    existing = db.query(MembreGroupe).filter(
        MembreGroupe.groupe_id == groupe_id,
        MembreGroupe.utilisateur_id == data.utilisateur_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Membre déjà dans le groupe")
    membre = MembreGroupe(groupe_id=groupe_id, utilisateur_id=data.utilisateur_id, role=data.role)
    db.add(membre)
    db.commit()
    db.refresh(membre)
    return membre


def get_membres(db: Session, groupe_id: int):
    return db.query(MembreGroupe).filter(MembreGroupe.groupe_id == groupe_id).all()

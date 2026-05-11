from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Categorie
from app import schemas


def create(db: Session, data: schemas.CategorieCreate, user_id: int):
    categorie = Categorie(nom=data.nom, type=data.type, utilisateur_id=user_id)
    db.add(categorie)
    db.commit()
    db.refresh(categorie)
    return categorie


def get_all(db: Session, user_id: int):
    return db.query(Categorie).filter(
        (Categorie.utilisateur_id == user_id) | (Categorie.utilisateur_id == None)
    ).all()


def get_by_id(db: Session, categorie_id: int):
    categorie = db.query(Categorie).filter(Categorie.id == categorie_id).first()
    if not categorie:
        raise HTTPException(status_code=404, detail="Catégorie introuvable")
    return categorie


def delete(db: Session, categorie_id: int):
    categorie = get_by_id(db, categorie_id)
    db.delete(categorie)
    db.commit()

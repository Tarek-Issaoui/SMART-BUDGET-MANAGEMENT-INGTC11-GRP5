from sqlalchemy.orm import Session
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.models import Utilisateur
from app import schemas, auth


def register(db: Session, data: schemas.UtilisateurCreate):
    if db.query(Utilisateur).filter(Utilisateur.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    if db.query(Utilisateur).filter(Utilisateur.nom_utilisateur == data.nom_utilisateur).first():
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà utilisé")
    user = Utilisateur(
        nom_utilisateur=data.nom_utilisateur,
        email=data.email,
        mot_de_passe=auth.hash_password(data.mot_de_passe),
        role=data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login(db: Session, form: OAuth2PasswordRequestForm):
    user = db.query(Utilisateur).filter(
        (Utilisateur.email == form.username) | (Utilisateur.nom_utilisateur == form.username)
    ).first()
    if not user or not auth.verify_password(form.password, user.mot_de_passe):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    token = auth.create_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


def get_all(db: Session):
    return db.query(Utilisateur).all()


def get_by_id(db: Session, user_id: int):
    user = db.query(Utilisateur).filter(Utilisateur.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return user


def delete(db: Session, user_id: int):
    user = get_by_id(db, user_id)
    db.delete(user)
    db.commit()

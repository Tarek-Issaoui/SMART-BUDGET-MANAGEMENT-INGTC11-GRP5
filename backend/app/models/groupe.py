from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Groupe(Base):
    __tablename__ = "groupes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(100), nullable=False)
    cree_par = Column(Integer, ForeignKey("utilisateurs.id"), nullable=False)
    cree_le = Column(DateTime, default=datetime.now)

class MembreGroupe(Base):
    __tablename__ = "membres_groupe"

    groupe_id = Column(Integer, ForeignKey("groupes.id"), primary_key=True)
    utilisateur_id = Column(Integer, ForeignKey("utilisateurs.id"), primary_key=True)
    role = Column(Enum("proprietaire", "editeur", "lecteur"), default="lecteur")
    rejoint_le = Column(DateTime, default=datetime.now)

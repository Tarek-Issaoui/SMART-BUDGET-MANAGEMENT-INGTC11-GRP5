from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from app.database import Base

class Categorie(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(50), nullable=False)
    type = Column(Enum("revenu", "depense"), nullable=False)
    utilisateur_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=True)

from sqlalchemy import Column, Integer, String, Enum, DateTime
from datetime import datetime
from app.database import Base

class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom_utilisateur = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    mot_de_passe = Column(String(255), nullable=False)
    role = Column(Enum("admin", "membre"), default="membre")
    cree_le = Column(DateTime, default=datetime.now)

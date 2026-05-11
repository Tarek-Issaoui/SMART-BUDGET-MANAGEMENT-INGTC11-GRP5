from sqlalchemy import Column, Integer, String, Enum, Date, Numeric, ForeignKey
from app.database import Base

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(100), nullable=False)
    montant = Column(Numeric(10, 2), nullable=False)
    periode = Column(Enum("hebdomadaire", "mensuel", "annuel"), nullable=False)
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date, nullable=False)
    categorie_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    utilisateur_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=True)
    groupe_id = Column(Integer, ForeignKey("groupes.id"), nullable=True)

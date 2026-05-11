from sqlalchemy import Column, Integer, String, Enum, Date, DateTime, Numeric, ForeignKey
from datetime import datetime
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    montant = Column(Numeric(10, 2), nullable=False)
    type = Column(Enum("revenu", "depense"), nullable=False)
    description = Column(String(255), nullable=True)
    date = Column(Date, nullable=False)
    categorie_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=True)
    utilisateur_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=False)
    groupe_id = Column(Integer, ForeignKey("groupes.id"), nullable=True)
    cree_le = Column(DateTime, default=datetime.now)

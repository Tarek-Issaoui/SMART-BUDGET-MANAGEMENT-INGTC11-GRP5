from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Alerte(Base):
    __tablename__ = "alertes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=False)
    utilisateur_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=False)
    message = Column(String(255), nullable=True)
    est_lu = Column(Boolean, default=False)
    cree_le = Column(DateTime, default=datetime.now)

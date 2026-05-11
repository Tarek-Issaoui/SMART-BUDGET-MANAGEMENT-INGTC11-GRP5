from fastapi import FastAPI
from app.database import Base, engine
from app.routes import (
    utilisateur_routes,
    groupe_routes,
    categorie_routes,
    budget_routes,
    transaction_routes,
    alerte_routes,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Budget API")

app.include_router(utilisateur_routes.router)
app.include_router(groupe_routes.router)
app.include_router(categorie_routes.router)
app.include_router(budget_routes.router)
app.include_router(transaction_routes.router)
app.include_router(alerte_routes.router)

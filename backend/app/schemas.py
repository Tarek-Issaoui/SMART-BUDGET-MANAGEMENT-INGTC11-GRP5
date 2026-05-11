from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime
from enum import Enum


# ── Enums ──────────────────────────────────────────────────────────────────────

class RoleUser(str, Enum):
    admin = "admin"
    membre = "membre"

class RoleGroupe(str, Enum):
    proprietaire = "proprietaire"
    editeur = "editeur"
    lecteur = "lecteur"

class TypeCategorie(str, Enum):
    revenu = "revenu"
    depense = "depense"

class Periode(str, Enum):
    hebdomadaire = "hebdomadaire"
    mensuel = "mensuel"
    annuel = "annuel"


# ── Utilisateur ────────────────────────────────────────────────────────────────

class UtilisateurCreate(BaseModel):
    nom_utilisateur: str
    email: EmailStr
    mot_de_passe: str
    role: RoleUser = RoleUser.membre

class UtilisateurRead(BaseModel):
    id: int
    nom_utilisateur: str
    email: EmailStr
    role: RoleUser
    cree_le: datetime
    model_config = {"from_attributes": True}


# ── Groupe ─────────────────────────────────────────────────────────────────────

class GroupeCreate(BaseModel):
    nom: str

class GroupeRead(BaseModel):
    id: int
    nom: str
    cree_par: int
    cree_le: datetime
    model_config = {"from_attributes": True}


# ── MembreGroupe ───────────────────────────────────────────────────────────────

class MembreGroupeCreate(BaseModel):
    utilisateur_id: int
    role: RoleGroupe = RoleGroupe.lecteur

class MembreGroupeRead(BaseModel):
    groupe_id: int
    utilisateur_id: int
    role: RoleGroupe
    rejoint_le: datetime
    model_config = {"from_attributes": True}


# ── Categorie ──────────────────────────────────────────────────────────────────

class CategorieCreate(BaseModel):
    nom: str
    type: TypeCategorie

class CategorieRead(BaseModel):
    id: int
    nom: str
    type: TypeCategorie
    utilisateur_id: Optional[int]
    model_config = {"from_attributes": True}


# ── Budget ─────────────────────────────────────────────────────────────────────

class BudgetCreate(BaseModel):
    nom: str
    montant: float
    periode: Periode
    date_debut: date
    date_fin: date
    categorie_id: Optional[int] = None
    groupe_id: Optional[int] = None

class BudgetRead(BaseModel):
    id: int
    nom: str
    montant: float
    periode: Periode
    date_debut: date
    date_fin: date
    categorie_id: Optional[int]
    utilisateur_id: Optional[int]
    groupe_id: Optional[int]
    model_config = {"from_attributes": True}


# ── Transaction ────────────────────────────────────────────────────────────────

class TransactionCreate(BaseModel):
    montant: float
    type: TypeCategorie
    description: Optional[str] = None
    date: date
    categorie_id: int
    budget_id: Optional[int] = None
    groupe_id: Optional[int] = None

class TransactionRead(BaseModel):
    id: int
    montant: float
    type: TypeCategorie
    description: Optional[str]
    date: date
    categorie_id: int
    budget_id: Optional[int]
    utilisateur_id: int
    groupe_id: Optional[int]
    cree_le: datetime
    model_config = {"from_attributes": True}


# ── Alerte ─────────────────────────────────────────────────────────────────────

class AlerteRead(BaseModel):
    id: int
    budget_id: int
    utilisateur_id: int
    message: Optional[str]
    est_lu: bool
    cree_le: datetime
    model_config = {"from_attributes": True}


# ── Auth ───────────────────────────────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str

"""
Seed script — run from the backend/ folder:
    python seed.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import date, datetime, timedelta
from app.database import SessionLocal, engine, Base
from app.models.utilisateur import Utilisateur
from app.models.groupe import Groupe, MembreGroupe
from app.models.categorie import Categorie
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.models.alerte import Alerte
from app.auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── helpers ───────────────────────────────────────────────────────────────────
def d(s: str) -> date:
    return date.fromisoformat(s)

def dt(s: str) -> datetime:
    return datetime.fromisoformat(s)

# ── clean existing data (order matters for FK) ────────────────────────────────
print("Cleaning existing data...")
db.query(Alerte).delete()
db.query(Transaction).delete()
db.query(Budget).delete()
db.query(Categorie).delete()
db.query(MembreGroupe).delete()
db.query(Groupe).delete()
db.query(Utilisateur).delete()
db.commit()

# ── 1. Utilisateurs ───────────────────────────────────────────────────────────
print("Seeding users...")
tarek = Utilisateur(nom_utilisateur="tarek_issaoui", email="tarek.issaoui@gmail.com",
                    mot_de_passe=hash_password("0123tarek"), role="admin")
sarra = Utilisateur(nom_utilisateur="sarra_mansouri", email="sarra.mansouri@gmail.com",
                    mot_de_passe=hash_password("sarra2024"), role="membre")
karim = Utilisateur(nom_utilisateur="karim_trabelsi", email="karim.trabelsi@gmail.com",
                    mot_de_passe=hash_password("karim2024"), role="membre")
nadia = Utilisateur(nom_utilisateur="nadia_gharbi", email="nadia.gharbi@gmail.com",
                    mot_de_passe=hash_password("nadia2024"), role="membre")

db.add_all([tarek, sarra, karim, nadia])
db.commit()
for u in [tarek, sarra, karim, nadia]:
    db.refresh(u)

print(f"  tarek id={tarek.id}, sarra id={sarra.id}, karim id={karim.id}, nadia id={nadia.id}")

# ── 2. Groupes ────────────────────────────────────────────────────────────────
print("Seeding groups...")
g_famille = Groupe(nom="Famille Issaoui", cree_par=tarek.id, cree_le=dt("2025-01-10 10:00:00"))
g_startup = Groupe(nom="Startup TechTN", cree_par=tarek.id, cree_le=dt("2025-02-15 09:00:00"))
g_coloc   = Groupe(nom="Colocation Manar", cree_par=sarra.id, cree_le=dt("2025-03-01 08:00:00"))

db.add_all([g_famille, g_startup, g_coloc])
db.commit()
for g in [g_famille, g_startup, g_coloc]:
    db.refresh(g)

# membres
membres = [
    MembreGroupe(groupe_id=g_famille.id, utilisateur_id=tarek.id, role="proprietaire"),
    MembreGroupe(groupe_id=g_famille.id, utilisateur_id=sarra.id, role="editeur"),
    MembreGroupe(groupe_id=g_startup.id, utilisateur_id=tarek.id, role="proprietaire"),
    MembreGroupe(groupe_id=g_startup.id, utilisateur_id=karim.id, role="editeur"),
    MembreGroupe(groupe_id=g_startup.id, utilisateur_id=nadia.id, role="lecteur"),
    MembreGroupe(groupe_id=g_coloc.id,   utilisateur_id=sarra.id, role="proprietaire"),
    MembreGroupe(groupe_id=g_coloc.id,   utilisateur_id=karim.id, role="editeur"),
]
db.add_all(membres)
db.commit()

# ── 3. Categories (global — utilisateur_id=None) ─────────────────────────────
print("Seeding categories...")
cats_data = [
    # revenus
    ("Salaire",         "revenu"),
    ("Freelance",       "revenu"),
    ("Investissements", "revenu"),
    ("Remboursement",   "revenu"),
    # depenses
    ("Loyer",           "depense"),
    ("Alimentation",    "depense"),
    ("Transport",       "depense"),
    ("Santé",           "depense"),
    ("Loisirs",         "depense"),
    ("Éducation",       "depense"),
    ("Factures",        "depense"),
    ("Vêtements",       "depense"),
    ("Restaurants",     "depense"),
    ("Épargne",         "depense"),
]
cats = {}
for nom, typ in cats_data:
    c = Categorie(nom=nom, type=typ, utilisateur_id=None)
    db.add(c)
    db.flush()
    cats[nom] = c

db.commit()
for c in cats.values():
    db.refresh(c)

print(f"  {len(cats)} categories created")

# ── 4. Budgets (all owned by tarek) ──────────────────────────────────────────
print("Seeding budgets...")
budgets_data = [
    # (nom, montant, periode, date_debut, date_fin, cat_nom, groupe)
    ("Budget Alimentation Juin",  900.00, "mensuel",  "2025-06-01", "2025-06-30", "Alimentation",    g_famille.id),
    ("Budget Transport Juin",     350.00, "mensuel",  "2025-06-01", "2025-06-30", "Transport",       None),
    ("Budget Loisirs Été",       1500.00, "mensuel",  "2025-06-01", "2025-06-30", "Loisirs",         None),
    ("Dépenses Startup Juin",    6000.00, "mensuel",  "2025-06-01", "2025-06-30", "Éducation",       g_startup.id),
    ("Charges Colocation",        700.00, "mensuel",  "2025-06-01", "2025-06-30", "Loyer",           g_coloc.id),
    ("Budget Santé Annuel",      2500.00, "annuel",   "2025-01-01", "2025-12-31", "Santé",           None),
    ("Budget Restaurants",        400.00, "mensuel",  "2025-06-01", "2025-06-30", "Restaurants",     None),
    ("Épargne Hebdo",             200.00, "hebdomadaire", "2025-06-02", "2025-06-08", "Épargne",     None),
    ("Budget Vêtements",          300.00, "mensuel",  "2025-06-01", "2025-06-30", "Vêtements",       None),
    ("Budget Factures",           250.00, "mensuel",  "2025-06-01", "2025-06-30", "Factures",        None),
]
budgets = {}
for nom, montant, periode, dd, df, cat_nom, grp_id in budgets_data:
    b = Budget(
        nom=nom, montant=montant, periode=periode,
        date_debut=d(dd), date_fin=d(df),
        categorie_id=cats[cat_nom].id,
        utilisateur_id=tarek.id,
        groupe_id=grp_id,
    )
    db.add(b)
    db.flush()
    budgets[nom] = b

db.commit()
for b in budgets.values():
    db.refresh(b)

print(f"  {len(budgets)} budgets created")

# ── 5. Transactions ───────────────────────────────────────────────────────────
print("Seeding transactions...")

B = budgets  # shorthand
C = cats

txs = [
    # ── Revenus tarek ──────────────────────────────────────────────────────────
    Transaction(montant=4200.00, type="revenu",  description="Salaire juin 2025",
                date=d("2025-06-01"), categorie_id=C["Salaire"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=1800.00, type="revenu",  description="Mission Freelance – Nexio Corp",
                date=d("2025-06-05"), categorie_id=C["Freelance"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=320.00,  type="revenu",  description="Dividendes portefeuille",
                date=d("2025-06-14"), categorie_id=C["Investissements"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=950.00,  type="revenu",  description="Mission Freelance – AlphaTech",
                date=d("2025-06-22"), categorie_id=C["Freelance"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=150.00,  type="revenu",  description="Remboursement Karim",
                date=d("2025-06-25"), categorie_id=C["Remboursement"].id,
                utilisateur_id=tarek.id),

    # ── Dépenses tarek ─────────────────────────────────────────────────────────
    Transaction(montant=680.00,  type="depense", description="Loyer appartement juin",
                date=d("2025-06-05"), categorie_id=C["Loyer"].id,
                budget_id=B["Charges Colocation"].id, groupe_id=g_coloc.id,
                utilisateur_id=tarek.id),
    Transaction(montant=95.50,   type="depense", description="Marché Central – Légumes & fruits",
                date=d("2025-06-08"), categorie_id=C["Alimentation"].id,
                budget_id=B["Budget Alimentation Juin"].id, groupe_id=g_famille.id,
                utilisateur_id=tarek.id),
    Transaction(montant=110.00,  type="depense", description="Carburant – Station Total",
                date=d("2025-06-09"), categorie_id=C["Transport"].id,
                budget_id=B["Budget Transport Juin"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=48.00,   type="depense", description="Pharmacie Centrale",
                date=d("2025-06-10"), categorie_id=C["Santé"].id,
                budget_id=B["Budget Santé Annuel"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=35.00,   type="depense", description="Cinéma City Stars",
                date=d("2025-06-12"), categorie_id=C["Loisirs"].id,
                budget_id=B["Budget Loisirs Été"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=72.00,   type="depense", description="Facture STEG",
                date=d("2025-06-15"), categorie_id=C["Factures"].id,
                budget_id=B["Budget Factures"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=145.00,  type="depense", description="Carrefour Market",
                date=d("2025-06-16"), categorie_id=C["Alimentation"].id,
                budget_id=B["Budget Alimentation Juin"].id, groupe_id=g_famille.id,
                utilisateur_id=tarek.id),
    Transaction(montant=200.00,  type="depense", description="Abonnement Coursera – Équipe",
                date=d("2025-06-17"), categorie_id=C["Éducation"].id,
                budget_id=B["Dépenses Startup Juin"].id, groupe_id=g_startup.id,
                utilisateur_id=tarek.id),
    Transaction(montant=88.00,   type="depense", description="Restaurant La Goulette",
                date=d("2025-06-18"), categorie_id=C["Restaurants"].id,
                budget_id=B["Budget Restaurants"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=25.00,   type="depense", description="Taxi Bolt",
                date=d("2025-06-20"), categorie_id=C["Transport"].id,
                budget_id=B["Budget Transport Juin"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=42.00,   type="depense", description="Facture SONEDE",
                date=d("2025-06-25"), categorie_id=C["Factures"].id,
                budget_id=B["Budget Factures"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=185.00,  type="depense", description="Achat vêtements Zara",
                date=d("2025-06-21"), categorie_id=C["Vêtements"].id,
                budget_id=B["Budget Vêtements"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=200.00,  type="depense", description="Épargne semaine 23",
                date=d("2025-06-07"), categorie_id=C["Épargne"].id,
                budget_id=B["Épargne Hebdo"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=65.00,   type="depense", description="Médicaments & analyses",
                date=d("2025-06-19"), categorie_id=C["Santé"].id,
                budget_id=B["Budget Santé Annuel"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=320.00,  type="depense", description="Serveur cloud AWS – Startup",
                date=d("2025-06-10"), categorie_id=C["Éducation"].id,
                budget_id=B["Dépenses Startup Juin"].id, groupe_id=g_startup.id,
                utilisateur_id=tarek.id),
    Transaction(montant=78.00,   type="depense", description="Supermarché Monoprix",
                date=d("2025-06-23"), categorie_id=C["Alimentation"].id,
                budget_id=B["Budget Alimentation Juin"].id, groupe_id=g_famille.id,
                utilisateur_id=tarek.id),
    Transaction(montant=55.00,   type="depense", description="Abonnement Spotify + Netflix",
                date=d("2025-06-01"), categorie_id=C["Loisirs"].id,
                budget_id=B["Budget Loisirs Été"].id,
                utilisateur_id=tarek.id),
    Transaction(montant=130.00,  type="depense", description="Déjeuner équipe startup",
                date=d("2025-06-13"), categorie_id=C["Restaurants"].id,
                budget_id=B["Budget Restaurants"].id, groupe_id=g_startup.id,
                utilisateur_id=tarek.id),
    Transaction(montant=95.00,   type="depense", description="Essence + péage autoroute",
                date=d("2025-06-24"), categorie_id=C["Transport"].id,
                budget_id=B["Budget Transport Juin"].id,
                utilisateur_id=tarek.id),

    # ── Revenus sarra ──────────────────────────────────────────────────────────
    Transaction(montant=3100.00, type="revenu",  description="Salaire juin 2025",
                date=d("2025-06-01"), categorie_id=C["Salaire"].id,
                utilisateur_id=sarra.id),
    Transaction(montant=600.00,  type="revenu",  description="Cours particuliers",
                date=d("2025-06-15"), categorie_id=C["Freelance"].id,
                utilisateur_id=sarra.id),

    # ── Dépenses sarra ─────────────────────────────────────────────────────────
    Transaction(montant=340.00,  type="depense", description="Part loyer colocation",
                date=d("2025-06-05"), categorie_id=C["Loyer"].id,
                groupe_id=g_coloc.id, utilisateur_id=sarra.id),
    Transaction(montant=120.00,  type="depense", description="Courses Géant",
                date=d("2025-06-10"), categorie_id=C["Alimentation"].id,
                groupe_id=g_famille.id, utilisateur_id=sarra.id),
    Transaction(montant=45.00,   type="depense", description="Transport mensuel",
                date=d("2025-06-03"), categorie_id=C["Transport"].id,
                utilisateur_id=sarra.id),

    # ── Revenus karim ──────────────────────────────────────────────────────────
    Transaction(montant=2800.00, type="revenu",  description="Salaire juin 2025",
                date=d("2025-06-01"), categorie_id=C["Salaire"].id,
                utilisateur_id=karim.id),
    Transaction(montant=400.00,  type="revenu",  description="Vente matériel informatique",
                date=d("2025-06-18"), categorie_id=C["Remboursement"].id,
                utilisateur_id=karim.id),

    # ── Dépenses karim ─────────────────────────────────────────────────────────
    Transaction(montant=340.00,  type="depense", description="Part loyer colocation",
                date=d("2025-06-05"), categorie_id=C["Loyer"].id,
                groupe_id=g_coloc.id, utilisateur_id=karim.id),
    Transaction(montant=250.00,  type="depense", description="Formation en ligne",
                date=d("2025-06-12"), categorie_id=C["Éducation"].id,
                groupe_id=g_startup.id, utilisateur_id=karim.id),

    # ── Revenus nadia ──────────────────────────────────────────────────────────
    Transaction(montant=3500.00, type="revenu",  description="Salaire juin 2025",
                date=d("2025-06-01"), categorie_id=C["Salaire"].id,
                utilisateur_id=nadia.id),

    # ── Dépenses nadia ─────────────────────────────────────────────────────────
    Transaction(montant=180.00,  type="depense", description="Matériel bureau startup",
                date=d("2025-06-08"), categorie_id=C["Éducation"].id,
                groupe_id=g_startup.id, utilisateur_id=nadia.id),
    Transaction(montant=90.00,   type="depense", description="Sortie weekend",
                date=d("2025-06-14"), categorie_id=C["Loisirs"].id,
                utilisateur_id=nadia.id),
]

db.add_all(txs)
db.commit()
print(f"  {len(txs)} transactions created")

# ── 6. Alertes (budget dépassements) ─────────────────────────────────────────
print("Seeding alertes...")

# Compute totals per budget for tarek to trigger realistic alerts
transport_spent = 110 + 25 + 95  # = 230 < 350 → no alert
alim_spent      = 95.5 + 145 + 78  # = 318.5 < 900 → no alert
startup_spent   = 200 + 320  # = 520 < 6000 → no alert
# Let's add manual alerts for realism
alertes = [
    Alerte(budget_id=B["Budget Transport Juin"].id, utilisateur_id=tarek.id,
           message="Budget 'Transport Juin' à 66% — 230 DT dépensés sur 350 DT.",
           est_lu=False, cree_le=dt("2025-06-24 08:30:00")),
    Alerte(budget_id=B["Budget Alimentation Juin"].id, utilisateur_id=tarek.id,
           message="Budget 'Alimentation Juin' à 35% — 318.5 DT dépensés sur 900 DT.",
           est_lu=True,  cree_le=dt("2025-06-16 10:00:00")),
    Alerte(budget_id=B["Dépenses Startup Juin"].id, utilisateur_id=tarek.id,
           message="Budget 'Startup Juin' à 87% — 5 220 DT dépensés sur 6 000 DT.",
           est_lu=False, cree_le=dt("2025-06-20 14:00:00")),
    Alerte(budget_id=B["Charges Colocation"].id, utilisateur_id=tarek.id,
           message="Budget 'Charges Colocation' dépassé — 680 DT dépensés sur 700 DT (97%).",
           est_lu=False, cree_le=dt("2025-06-05 09:00:00")),
    Alerte(budget_id=B["Budget Restaurants"].id, utilisateur_id=tarek.id,
           message="Budget 'Restaurants' à 54% — 218 DT dépensés sur 400 DT.",
           est_lu=True,  cree_le=dt("2025-06-18 20:00:00")),
    Alerte(budget_id=B["Budget Santé Annuel"].id, utilisateur_id=tarek.id,
           message="Budget 'Santé Annuel' à 5% — 113 DT dépensés sur 2 500 DT.",
           est_lu=True,  cree_le=dt("2025-06-19 11:00:00")),
]
db.add_all(alertes)
db.commit()
print(f"  {len(alertes)} alertes created")

db.close()
print("\n✅ Seed completed successfully!")
print("\nCredentials:")
print("  tarek.issaoui@gmail.com  /  0123tarek  (admin)")
print("  sarra.mansouri@gmail.com /  sarra2024  (membre)")
print("  karim.trabelsi@gmail.com /  karim2024  (membre)")
print("  nadia.gharbi@gmail.com   /  nadia2024  (membre)")

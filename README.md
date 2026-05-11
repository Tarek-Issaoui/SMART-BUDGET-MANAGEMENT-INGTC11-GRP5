# SMART-BUDGET-MANAGEMENT-INGTC11-GRP5

backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── auth.py
│   ├── schemas.py          ← single file
│   ├── models/
│   │   ├── __init__.py
│   │   ├── utilisateur.py
│   │   ├── groupe.py
│   │   ├── categorie.py
│   │   ├── budget.py
│   │   ├── transaction.py
│   │   └── alerte.py
│   ├── controllers/
│   │   ├── __init__.py
│   │   ├── utilisateur_controller.py
│   │   ├── groupe_controller.py
│   │   ├── categorie_controller.py
│   │   ├── budget_controller.py
│   │   ├── transaction_controller.py
│   │   └── alerte_controller.py
│   └── routes/
│       ├── __init__.py
│       ├── utilisateur_routes.py
│       ├── groupe_routes.py
│       ├── categorie_routes.py
│       ├── budget_routes.py
│       ├── transaction_routes.py
│       └── alerte_routes.py
├── requirements.txt
└── .env


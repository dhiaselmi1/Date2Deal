# 📊 Date2Deal – AI-powered Executive Mapping & Outreach



![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)

![React](https://img.shields.io/badge/Frontend-React%2BTS-61DAFB?logo=react)

![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?logo=fastapi)

![Scraping](https://img.shields.io/badge/Scraping-LinkedIn%2FWeb-yellow)

![License](https://img.shields.io/badge/License-MIT-black)



## 📌 Overview



**Date2Deal** est une plateforme intelligente qui automatise la **prospection B2B**.  

À partir du **nom et de la localisation d’une entreprise**, l’outil :



1. 🔎 **Scrape et analyse** les données publiques (LinkedIn, YouTube, jugements, etc.).  

2. 🏢 Génère un **organigramme des décideurs et dirigeants**.  

3. 📝 Produit un **rapport détaillé par profil** (parcours, fonctions, image publique, etc.).  

4. 💬 Rédige automatiquement un **premier message de contact personnalisé**.  

5. 📊 Affiche le tout dans un **dashboard moderne** et interactif.



---



## ✨ Features



- **Frontend (React + TypeScript)**

  - UI moderne et responsive (Shadcn/UI + Tailwind).

  - Dashboard exécutif : organigramme + fiches détaillées.

  - AI Chat Page pour générer et tester des messages de contact.

  - Services intégrés pour récupérer les données entreprise/décideurs.



- **Backend (Python)**

  - Scraping LinkedIn, YouTube et autres sources.

  - Agents d’analyse et de résumé automatique.

  - Génération de rapports exécutifs (PDF, texte enrichi).

  - Orchestrateurs pour traiter une entreprise entière ou un seul profil.

  - Génération automatique du message de prospection.



---



## 📂 Project Structure



Date2Deal/

│── back/ # Backend (Python scraping + orchestration)

│ ├── orchestrator-all.py

│ ├── orchestrator-for-one-person.py

│ ├── profile_orchestrator_agent.py

│ ├── final_report_agent.py

│ ├── linkedin/ # LinkedIn scrapers & summarizers

│ ├── youtube/ # YouTube scrapers

│ └── ...

│

│── front/ # Frontend (React + TypeScript)

│ ├── dashboard.tsx

│ ├── ai-chat-page.tsx

│ ├── company-data-service.ts

│ ├── components.json

│ └── ...

│

│── README.md # You are here

│── requirements.txt # Backend dependencies

│── package.json # Frontend dependencies







---



## ⚙️ Installation



### 1️⃣ Clone the repository



```bash

git clone https://github.com/your-username/Date2Deal.git

cd Date2Deal

2️⃣ Backend setup (Python)

bash

Copier

Modifier

cd back

python -m venv venv

source venv/bin/activate   # (Linux/Mac)

venv\Scripts\activate      # (Windows)



pip install -r requirements.txt
```

## 👉 Run the backend (example with FastAPI or orchestrator script):



```bash

uvicorn orchestrator-all:app --reload --port 8000
```

3️⃣ Frontend setup (React + TS)

```bash



cd front

npm install

npm run dev
```

##👉 App will be available at: http://localhost:5173



## 🚀 Usage

Ouvrir le frontend (http://localhost:5173).



Entrer le nom et la localisation d’une entreprise.



Le backend collecte et analyse les données.



L’application affiche :



L’organigramme des décideurs.



Un rapport exécutif détaillé.



Un premier message de contact généré par l’IA.



## 📊 Example Workflow

Input :



yaml

Copier

Modifier

Entreprise : Talan Tunisie

Localisation : Tunis, Tunisie

Output :



Organigramme : CEO, CTO, Head of HR, etc.



Rapport détaillé pour chaque dirigeant.



Message de contact personnalisé généré automatiquement.



##🛠️ Tech Stack

Backend : Python, FastAPI, Scrapy, Requests, BeautifulSoup, OpenAI/Gemini APIs



Frontend : React, TypeScript, TailwindCSS, Shadcn/UI



Database (optionnel) : PostgreSQL / SQLite



Other : Puppeteer / Playwright (scraping), LangChain agents



## 🤝 Contributing

Les contributions sont les bienvenues 🎉



Fork le repo



Crée une branche : git checkout -b feature/ma-fonctionnalite



Commit : git commit -m "Ajout de ma fonctionnalité"



Push : git push origin feature/ma-fonctionnalite



Crée une Pull Request



##📜 License

This project is licensed under the MIT License – see the LICENSE file for details.

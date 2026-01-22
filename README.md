# Chat IA - Application Web

Application de chat simple avec intelligence artificielle utilisant Next.js et SQLite.

## Prérequis

- Node.js 18+
- Clé API Groq

## Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env et ajouter votre clé GROQ_API_KEY

# Initialiser la base de données
npx prisma db push --schema=backend/prisma/schema.prisma

# Lancer en développement
npm run dev
```

## Docker

```bash
docker build -t chat-ia .
docker run -p 3000:3000 -e GROQ_API_KEY=your_key chat-ia
```

## Structure

```
├── frontend/          # Interface React (composants, hooks)
├── backend/           # Logique serveur (services, Prisma)
├── app/               # Next.js App Router (pages, API)
├── data/              # Base de données SQLite
└── Dockerfile
```

## API

- `GET /api/chat` - Récupérer l'historique des messages
- `POST /api/chat` - Envoyer un message (body: `{ content: "..." }`)

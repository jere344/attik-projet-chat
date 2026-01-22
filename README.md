# Chat IA - Application Web

Application de chat simple avec intelligence artificielle utilisant Next.js et Supabase.

## Prérequis

- Node.js 18+
- Clé API Groq
- Base de données Supabase (PostgreSQL)

## Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env: ajouter GROQ_API_KEY et DATABASE_URL

# Initialiser la base de données
npx prisma db push --schema=backend/prisma/schema.prisma

# Lancer en développement
npm run dev
```

## Docker

```bash
# Avec docker-compose (recommandé)
docker-compose up --build

# Ou manuellement
docker build -t chat-ia .
docker run -p 3000:3000 -e GROQ_API_KEY=your_key chat-ia
```

## Structure

```
├── frontend/          # Interface React (composants, hooks)
├── backend/           # Logique serveur (services, Prisma)
├── app/               # Next.js App Router (pages, API)
└── Dockerfile
```

## API

- `GET /api/chat` - Récupérer l'historique des messages
- `POST /api/chat` - Envoyer un message (body: `{ content: "..." }`)

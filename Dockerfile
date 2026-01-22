FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Create data directory for SQLite
RUN mkdir -p data

# Generate Prisma client and run migrations
RUN npx prisma generate --schema=backend/prisma/schema.prisma
RUN npx prisma db push --schema=backend/prisma/schema.prisma

# Build Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

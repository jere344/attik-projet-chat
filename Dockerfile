FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy all project files first
COPY . .

# Install dependencies (postinstall will run prisma generate)
RUN npm install

# Generate Prisma client and push schema
RUN npx prisma generate --schema=backend/prisma/schema.prisma

# Build Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

FROM node:18-slim

# Install OpenSSL for Prisma (required for database connections)
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for Prisma)
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client (this step requires the schema and the prisma CLI)
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD [\"node\", \"src/app.js\"]

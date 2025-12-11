FROM node:18-slim
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
EXPOSE 8080
CMD [\"node\", \"src/app.js\"]

FROM node:18-slim
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/
# Actively remove UTF-8 BOM if present in schema file
RUN sed -i '1s/^\xEF\xBB\xBF//' prisma/schema.prisma 2>/dev/null || true
RUN npx prisma generate
COPY . .
EXPOSE 8080
CMD [\"node\", \"src/app.js\"]

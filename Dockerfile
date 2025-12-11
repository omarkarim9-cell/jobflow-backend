FROM node:18-slim
RUN apt-get update && apt-get install -y openssl
WORKDIR /app

# Copy package files first (this layer is cached)
COPY package*.json ./
RUN npm ci

# Add a cache-busting layer before copying prisma
# This ensures we always get fresh schema.prisma
ARG BUILD_DATE
RUN echo "Build date: "

# Now copy and clean the prisma schema
COPY prisma ./prisma/
# Use multiple methods to ensure BOM removal
RUN sed -i '1s/^\xEF\xBB\xBF//' prisma/schema.prisma 2>/dev/null || true
RUN sed -i '1s/^\xFE\xFF//' prisma/schema.prisma 2>/dev/null || true
RUN sed -i '1s/^\xFF\xFE//' prisma/schema.prisma 2>/dev/null || true

# Now generate Prisma client
RUN npx prisma generate

# Copy the rest of the app
COPY . .

EXPOSE 8080
CMD [\"node\", \"src/app.js\"]

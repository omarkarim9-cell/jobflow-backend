FROM node:18-slim
RUN apt-get update && apt-get install -y openssl
WORKDIR /app

# Copy package files first
COPY package*.json ./
RUN npm ci

# Create the prisma directory and schema.prisma file directly in the container
# This ensures no BOM can be introduced from the host or git
RUN mkdir -p prisma
RUN cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Profile {
  id                 String   @id @db.Text
  email              String?  @unique @db.Text
  full_name          String?  @db.Text
  resume_content     String?  @db.Text
  preferences        Json?    @default("{}")
  connected_accounts Json?    @default("{}")
  plan               String?  @default("free") @db.Text
  daily_ai_credits   Int      @default(5)
  total_ai_used      Int      @default(0)
  updated_at         DateTime @default(now()) @db.Timestamptz
  jobs               Job[]

  @@map("profiles")
}

model Job {
  id              String   @id @default(cuid()) @db.Text
  user_id         String   @db.Text
  title           String?  @db.Text
  company         String?  @db.Text
  description     String?  @db.Text
  status          String?  @default("saved") @db.Text
  source          String?  @db.Text
  application_url String?  @db.Text
  custom_resume   String?  @db.Text
  cover_letter    String?  @db.Text
  match_score     Int?
  data            Json?    @default("{}")
  created_at      DateTime @default(now()) @db.Timestamptz
  updated_at      DateTime @default(now()) @db.Timestamptz
  profile         Profile  @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@map("jobs")
}
EOF

# Now generate Prisma client
RUN npx prisma generate

# Copy the rest of the app (excluding prisma folder since we already created it)
COPY . .
# Remove the copied prisma folder if it exists (to avoid conflict)
RUN rm -rf prisma 2>/dev/null || true
# Move the generated prisma folder to the correct location
RUN mv /app/prisma ./prisma 2>/dev/null || true

EXPOSE 8080
CMD [\"node\", \"src/app.js\"]

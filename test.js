@"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const result = await prisma.\$queryRaw\`SELECT 1 as test\`;
    console.log('✅ Database connected:', result);
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
  process.exit();
}

test();
"@ | Out-File -FilePath "test-db.js" -Encoding UTF8

node test-db.js
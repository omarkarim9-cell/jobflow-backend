{
  "name": "jobflow-backend",
  "version": "1.0.0",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@clerk/clerk-sdk-node": "^0.25.2",
    "@prisma/client": "^5.7.1",
    "bull": "^4.11.5",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "redis": "^4.6.13"
  },
  "devDependencies": {
    "nodemon": "^3.1.0",
    "prisma": "^5.7.1"
  }
}
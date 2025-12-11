FROM node:18-slim
WORKDIR /app
COPY package.json ./
RUN npm install
COPY src/app.js ./
EXPOSE 8080
CMD [\"node\", \"app.js\"]

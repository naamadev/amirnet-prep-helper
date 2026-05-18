FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN npx prisma generate && npm run build

RUN mkdir -p /data/uploads

ENV NODE_ENV=production
ENV UPLOADS_DIR=/data/uploads
ENV DATABASE_URL="file:/data/prod.db"

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push && node dist/server.js"]

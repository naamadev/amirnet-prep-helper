FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

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

CMD ["sh", "-c", "mkdir -p /data/uploads && npx prisma db push && node dist/server.js"]

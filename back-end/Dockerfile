FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY public ./public

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "src/server.js"]

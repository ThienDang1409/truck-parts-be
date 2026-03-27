FROM node:20-alpine

COPY package*.json ./
RUN npm ci

COPY dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY .env .env

# Xóa devDependencies trước
RUN npm prune --omit=dev

# Generate sau khi prune để không bị xóa
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
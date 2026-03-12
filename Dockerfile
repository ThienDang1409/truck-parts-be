FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built application
COPY dist ./dist

# Copy Prisma files
COPY prisma ./prisma
COPY .env .env

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main"]

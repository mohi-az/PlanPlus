# Multi-stage build for optimized Docker image
# Stage 1: Dependencies
FROM node:22.13.0-alpine AS deps
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Builder
FROM node:22.13.0-alpine AS builder
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 3: Runner - Production image
FROM node:22.13.0-alpine AS runner
RUN apk add --no-cache openssl libc6-compat dumb-init

WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "server.js"]

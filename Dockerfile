FROM node:22.13.0-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm i --force

# Copy the rest of the app
COPY . .

# Prisma generate
RUN npx prisma generate


RUN npm run build

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]

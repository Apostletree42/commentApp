FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./ 

# Install production dependencies
RUN npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Copy TypeScript config files
COPY tsconfig.json ./
COPY mikro-orm.migrations.ts ./
COPY mikro-orm.config.ts ./

# Install TypeScript and support packages
RUN npm install --save ts-node typescript @mikro-orm/cli @mikro-orm/postgresql @mikro-orm/core

# Create migration directories
RUN mkdir -p src/migrations src/seeders

# Expose the port the app runs on
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "dist/src/main"]
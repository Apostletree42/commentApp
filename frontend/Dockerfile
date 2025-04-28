FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Use regular install instead of ci to update the lock file
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx to serve static files
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Command to run the server
CMD ["nginx", "-g", "daemon off;"]
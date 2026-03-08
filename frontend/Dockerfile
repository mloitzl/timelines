# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for API URLs
ARG VITE_API_URL=http://localhost:4000/graphql
ARG VITE_WS_URL=ws://localhost:4000/graphql
ARG VITE_APP_ENV=dev
ARG VITE_BACKEND_URL=http://localhost:4000
ARG VITE_NEW_RELIC_ACCOUNT_ID
ARG VITE_NEW_RELIC_AGENT_ID
ARG VITE_NEW_RELIC_APPLICATION_ID
ARG VITE_NEW_RELIC_LICENSE_KEY

# Build the application with environment variables
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (optional - if you need custom config)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


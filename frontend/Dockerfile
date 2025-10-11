# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Create backend directory and copy schema (needed for Relay compiler)
RUN mkdir -p ../backend
COPY schema.graphql ../backend/schema.graphql

# Copy source code
COPY . .

# Build arguments for API URLs
ARG VITE_API_URL=http://host.docker.internal:4000/graphql
ARG VITE_WS_URL=ws://host.docker.internal:4000/graphql

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


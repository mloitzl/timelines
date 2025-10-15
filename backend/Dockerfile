# Use Node.js LTS (Long Term Support) as base image
FROM node:20-slim AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY tsconfig.json ./
COPY src/ ./src/

# Build TypeScript code
RUN npm run build

# Backend server stage
FROM base AS backend
# Expose port 4000 for GraphQL server
EXPOSE 4000
# Start the server
CMD ["npm", "start"]

# Event processor stage
FROM base AS event-processor
# Start the event processor
CMD ["npm", "run", "processor"]
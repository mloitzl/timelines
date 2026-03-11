# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Copy workspace root files (needed for pnpm to resolve the lockfile)
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Copy all workspace package.json files so pnpm can build the full dependency graph
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
COPY event-processor/package.json ./event-processor/package.json

# Install all workspace dependencies
# node-linker=hoisted ensures deps land in each package's node_modules (Docker compatible)
RUN echo "node-linker=hoisted" > .npmrc && pnpm install --frozen-lockfile

# Copy frontend source and schema
COPY frontend/ ./frontend/
COPY backend/schema.graphql ./frontend/schema.graphql

# Build arguments
ARG VITE_API_URL=http://localhost:4000/graphql
ARG VITE_WS_URL=ws://localhost:4000/graphql
ARG VITE_APP_ENV=dev
ARG VITE_BACKEND_URL=http://localhost:4000
ARG VITE_LOGROCKET_APP_ID

# Build the frontend package
RUN pnpm --filter frontend run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


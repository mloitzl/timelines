FROM node:20-alpine AS base

FROM base AS builder

RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

WORKDIR /app

# Copy workspace root files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Copy all workspace package.json files
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
COPY event-processor/package.json ./event-processor/package.json

# Install all workspace dependencies
RUN echo "node-linker=hoisted" > .npmrc && pnpm install --frozen-lockfile

# Copy backend source
COPY backend/tsconfig.json ./backend/tsconfig.json
COPY backend/src/ ./backend/src/
COPY backend/schema.graphql ./backend/schema.graphql

# Build TypeScript
RUN pnpm --filter timelines-backend run build

# Production stage
FROM base

RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
COPY event-processor/package.json ./event-processor/package.json

RUN echo "node-linker=hoisted" > .npmrc && pnpm install --frozen-lockfile --prod

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/schema.graphql ./backend/schema.graphql

EXPOSE 4000

CMD ["node", "backend/dist/index.js"]
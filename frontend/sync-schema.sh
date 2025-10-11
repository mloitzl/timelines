#!/bin/bash
# Copy GraphQL schema from backend for Docker builds
cp ../backend/schema.graphql ./schema.graphql
echo "✓ Schema synced from backend"


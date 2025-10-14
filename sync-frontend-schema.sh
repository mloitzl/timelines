#!/bin/bash

# Sync GraphQL schema from backend to frontend

echo "📋 Syncing GraphQL schema from backend to frontend..."

cp backend/schema.graphql frontend/schema.graphql

echo "✅ Schema synced successfully!"
echo ""
echo "Next steps:"
echo "  1. cd frontend"
echo "  2. npm run relay  (to regenerate Relay artifacts)"
echo ""


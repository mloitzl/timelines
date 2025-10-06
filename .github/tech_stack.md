# Tech Stack Overview

## Core Languages
- TypeScript (backend and frontend)

## Frontend
- React (with TypeScript)
- Relay (GraphQL data fetching)
- Apollo Client (GraphQL transport layer, caching)
- UI: Material-UI or Ant Design (suggested)

## Backend
- Node.js (TypeScript)
- Apollo Server (GraphQL API)
- Event sourcing/projection logic in TypeScript

## Event Store
- **Preferred:** EventStoreDB (native event sourcing, Docker/K8s-ready)
- **Alternative:** MongoDB (documents as events, easier prototypes, also Docker/K8s-ready)

## Infrastructure
- Kubernetes (deployment, scaling, and service management)
- Docker (local development and image builds)
- Portainer (GUI for Docker/K8s management)

## DevOps & Tooling
- Docker Compose (local dev orchestration)
- kubectl (K8s CLI)
- Helm (optional, for advanced deployments)
- Github Copilot (AI code suggestions)
- Claude (AI explanations/prompts)

## Optional Integrations
- Home Assistant or Shelly webhooks (event inputs)
- MQTT broker (future integration)

---

All tools and frameworks chosen for TypeScript-first, containerized, and event-sourced development.

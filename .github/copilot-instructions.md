# Project: Event-Sourced Home Automation Tracker

This project collects and tracks smart home events using an event sourcing pattern, fully typed in TypeScript, and deploys as microservices on Kubernetes or Docker.  
Frontend uses React + Relay with Apollo GraphQL; backend is a containerized Apollo GraphQL server; event data is persisted and projected for replay or querying.

---

## Project Structure

- `/backend`: TypeScript GraphQL API (Apollo, event ingestion, projections)
- `/event-store`: Event storage DB setup (EventStoreDB or MongoDB)
- `/frontend`: React app (Relay, Apollo Client)
- `/k8s`: Kubernetes manifests for deployment

---

## Step-by-Step Guide

1. **Clone or initialize repo.**  
   `git clone <your-repo-url>`  
   Create the directory structure above.

2. **Event Store Setup:**

   - Choose _EventStoreDB_ (preferable for pure event sourcing) or _MongoDB_ for rapid prototyping.
   - Add Docker compose or Kubernetes manifest to spin up the DB.

3. **Backend Service:**

   - Scaffold a Node.js TypeScript project (`npm init -y`, `tsc --init`).
   - Add and configure Apollo Server, with GraphQL schema for Event and Device mutations/queries.
   - Write mutation for event ingestion (accepting eventType, timestamp, payload).
   - Implement event-sourced state projection logic.
   - Persist all events to the selected event store.

4. **Frontend App:**

   - Scaffold a React project (TypeScript template) using `create-react-app` or Vite.
   - Set up Relay environment and Apollo Client.
   - Build component for event timeline display and device status (via GraphQL queries).
   - Add mutation UI to manually inject test events.

5. **Containerization:**

   - Write Dockerfiles for backend and frontend.
   - Build and test images locally (`docker build` and `docker-compose`).

6. **Kubernetes Deployment:**

   - Compose manifests or Helm charts for backend, frontend, and event store pods/services.
   - Use Portainer or kubectl to deploy and monitor.

7. **Development Workflow:**
   - Use TypeScript for both frontend and backend.
   - Write project and API documentation as you go.
   - Iteratively add new event types and projections.

---

## Advanced Ideas

- Add real webhooks from Home Assistant or Shelly devices.
- Implement snapshotting for fast state restoration.
- Add user authentication (OIDC, Auth0).
- Integrate MQTT event ingestion.

---

## Running Locally

- `docker-compose up --build` (for dev)
- Or use `kubectl apply -f k8s/` for Kubernetes
- Access the frontend at `localhost:3000`, API at `localhost:4000`

---

Designed for Github Copilot and Claude prompt expansion. For ambiguous steps, ask Claude or Copilot in-file!

# Timelines - Real-Time Event Processing & Device State Dashboard

A modern, real-time event processing system with a beautiful device state dashboard. Built with GraphQL, MongoDB Change Streams, React, and TypeScript.

## ✨ Features

- **🔄 Real-Time Event Processing** - MongoDB Change Streams for instant event processing
- **📊 Device State Dashboard** - Beautiful, live-updating device status interface
- **🌊 Saga Pattern Implementation** - Track long-running processes with DehumidifierRunSaga
- **⚡ GraphQL API** - Type-safe queries, mutations, and subscriptions
- **🎨 Modern UI** - Glassmorphism design with smooth animations
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🐳 Docker Ready** - Complete containerized setup
- **🔧 Extensible** - Easy to add new projections, sagas, and event types

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd timelines
cp .env.example .env  # Edit with your MongoDB credentials
```

### 2. Start Everything

```bash
docker-compose up
```

This starts:
- **MongoDB** (with replica set for Change Streams)
- **GraphQL API Server** (port 4000)
- **Event Processor** (background service)
- **Frontend** (port 3000)
- **Home Assistant** (port 8123)

### 3. Open the Dashboard

Visit: http://localhost:3000

You'll see a beautiful responsive layout:
- **Top Row**: Device States and Dehumidifier Runs side by side
- **Bottom Row**: Event Timeline spanning full width
- **Mobile**: Stacks vertically for optimal mobile experience

### 4. Test It Works

```bash
# Test the complete saga flow
./test-dehumidifier-saga.js

# Or test device state projections
./test-device-state-projection.js

# Watch the UI update in real-time! ✨
```

## 🎯 What You Get

### Real-Time Device Dashboard

- **Live Status Updates** - Devices update instantly when state changes
- **Visual Indicators** - Green pulsing dots for ON, gray for OFF
- **Friendly Names** - "Dehumidifier" instead of technical entity IDs
- **Relative Timestamps** - "2 minutes ago", "1 hour ago"
- **Statistics Bar** - Quick overview of ON/OFF counts

### Event Processing System

- **Automatic Processing** - Events are processed as soon as they're ingested
- **Device State Projections** - Current state maintained automatically
- **Saga Pattern** - Track long-running processes with complete lifecycle management
- **Extensible Framework** - Add new projections and sagas easily
- **Fault Tolerant** - Resume tokens for recovery from failures

### Dehumidifier Run Tracking (Saga Pattern)

- **Complete Lifecycle** - Tracks dehumidifier runs from start to finish
- **Card-Style Design** - Each run displayed as a distinct, beautiful card
- **Status-Based Color Coding** - Green for running, blue for finished, red for error
- **Real-Time Duration** - Live updates for running sagas every 10 seconds
- **Energy Consumption** - Calculates and displays energy used per run
- **Timeline Display** - Chronological list with newest runs on top
- **Status Management** - Running, finished, and error states with visual indicators
- **Automation Detection** - Tracks manual vs automated starts with icons (🤖/👤)
- **Responsive Design** - Optimized for desktop and mobile viewing

### GraphQL API

```graphql
# Query all device states
query {
  deviceStates {
    entityId
    currentState
    friendlyName
    lastChanged
  }
}

# Subscribe to real-time updates
subscription {
  deviceStateChanged {
    entityId
    currentState
    friendlyName
  }
}

# Query dehumidifier runs
query {
  dehumidifierRuns {
    id
    status
    startTime
    duration
    energyConsumed
    startedBy
  }
}

# Subscribe to dehumidifier run changes
subscription {
  dehumidifierRunChanged {
    id
    status
    duration
    energyConsumed
  }
}
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   GraphQL API    │    │   Event         │
│   (React)       │◄──►│   Server         │◄──►│   Processor     │
│   Port 3000     │    │   Port 4000      │    │   (Background)  │
└─────────────────┘    └────────┬─────────┘    └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │   MongoDB       │
                        │   (Replica Set) │
                        │   Port 27017    │
                        └─────────────────┘
```

**Data Flow:**
1. Events ingested via GraphQL mutations
2. Stored in MongoDB events collection
3. Change Stream triggers Event Processor
4. Projections & Sagas update derived state (device states, dehumidifier runs)
5. GraphQL subscriptions notify frontend
6. UI updates automatically

## 📁 Project Structure

```
timelines/
├── backend/                 # GraphQL API server
│   ├── src/
│   │   ├── index.ts        # GraphQL server setup
│   │   ├── resolvers.ts    # GraphQL resolvers
│   │   ├── models/         # MongoDB models
│   │   └── processor/      # Event processing framework
│   └── schema.graphql      # GraphQL schema
├── frontend/               # React + Relay frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── relay/          # GraphQL client setup
│   │   └── utils/          # Utility functions
│   └── package.json
├── event-processor/        # Background event processor
│   └── src/
│       ├── EventProcessor.ts
│       ├── projections/    # Event projections & sagas
│       │   ├── DeviceStateProjection.ts
│       │   └── DehumidifierRunSaga.ts
│       └── models/         # Data models
│           ├── DeviceState.ts
│           └── DehumidifierRun.ts
├── docker-compose.yaml     # Service orchestration
└── test-*.js              # Test scripts
```

## 🔧 Development

### Local Development

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Event Processor
cd event-processor
npm install
npm run dev

# Terminal 3: Frontend
cd frontend
npm install
npm run dev
```

### Adding New Event Types

1. Update the projection to handle new event types:
```typescript
// event-processor/src/projections/DeviceStateProjection.ts
eventTypes = ["DEHUMIDIFIER", "LIGHT", "SWITCH"]; // Add your types
```

2. Restart the processor:
```bash
docker-compose restart event-processor
```

### Adding New Sagas

1. Create a new saga projection:
```typescript
// event-processor/src/projections/MySaga.ts
export class MySaga implements IProjection {
  name = "MySaga";
  eventTypes = ["MY_EVENT_TYPE"];
  
  async process(event: ProcessedEvent): Promise<void> {
    // Your saga logic here
  }
}
```

2. Register it in the processor and restart.

### Adding New Projections

1. Create a new projection:
```typescript
// event-processor/src/projections/MyProjection.ts
export class MyProjection implements IProjection {
  name = "MyProjection";
  eventTypes = ["MY_EVENT_TYPE"];
  
  async process(event: ProcessedEvent): Promise<void> {
    // Your logic here
  }
}
```

2. Register it in the processor and restart.

## 📊 API Examples

### Ingest Events

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { ingestEvent(eventType: \"DEHUMIDIFIER\", payload: { entity_id: \"switch.test\", to_state: \"on\" }) { id } }"
  }'
```

### Query Device States

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ deviceStates { entityId currentState friendlyName } }"
  }'
```

## 🧪 Testing

```bash
# Test the complete saga flow
./test-dehumidifier-saga.js

# Test device state projections
./test-device-state-projection.js

# Simulate device events
node simulate-events.js

# Check logs
docker-compose logs -f event-processor
```

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `frontend` | 3000 | React dashboard |
| `graphql-server` | 4000 | GraphQL API |
| `mongodb` | 27017 | Database |
| `event-processor` | - | Background processor |
| `homeassistant` | 8123 | Home Assistant |

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture details
- **[API Documentation](./backend/schema.graphql)** - GraphQL schema
- **[Docker Setup](./docker-compose.yaml)** - Service configuration

## 🔮 Roadmap

### Immediate
- [x] Energy consumption tracking (DehumidifierRunSaga)
- [ ] Add more device types (lights, sensors, etc.)
- [ ] Device uptime statistics
- [ ] Humidity threshold tracking in automation events

### Future
- [ ] Complex automation workflows
- [ ] Historical data analysis
- [ ] Mobile app
- [ ] Multi-tenant support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Apollo GraphQL](https://www.apollographql.com/)
- UI powered by [React](https://reactjs.org/) and [Relay](https://relay.dev/)
- Database: [MongoDB](https://www.mongodb.com/)
- Containerization: [Docker](https://www.docker.com/)

---

**Ready to build amazing real-time applications?** 🚀

Start with `docker-compose up` and watch your devices come to life!


# Architecture Documentation

## System Overview

Timelines is a real-time event processing system built on modern web technologies. It uses MongoDB Change Streams for event processing, GraphQL for API communication, and React with Relay for the frontend.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  React Frontend (Port 3000)                                                │
│  ├── DeviceStateList Component                                             │
│  ├── EventList Component                                                   │
│  ├── Relay GraphQL Client                                                  │
│  └── WebSocket Subscriptions                                               │
└─────────────────────┬───────────────────────────────────────────────────────┘
                      │ GraphQL Queries/Mutations/Subscriptions
                      │ WebSocket (ws://)
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  GraphQL Server (Port 4000)                                                │
│  ├── Apollo Server                                                         │
│  ├── GraphQL Schema                                                        │
│  ├── Resolvers                                                             │
│  ├── PubSub (WebSocket)                                                    │
│  └── MongoDB Integration                                                   │
└─────────────────────┬───────────────────────────────────────────────────────┘
                      │ MongoDB Operations
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  MongoDB (Port 27017) - Replica Set: rs0                                   │
│  ├── events collection (raw events)                                        │
│  ├── devicestates collection (projected state)                             │
│  └── Change Streams (real-time notifications)                              │
└─────────────────────┬───────────────────────────────────────────────────────┘
                      │ Change Stream Events
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROCESSING LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Event Processor Service (Background)                                      │
│  ├── EventProcessor Core                                                   │
│  ├── Projection Framework                                                  │
│  ├── DeviceStateProjection                                                 │
│  └── Future: EnergyProjection, AlertProjection, etc.                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend (React + Relay)

**Location:** `frontend/`

**Technologies:**
- React 19.1.1
- Relay 20.1.1 (GraphQL client)
- TypeScript
- Vite (build tool)

**Key Components:**

#### DeviceStateList Component
```typescript
// Real-time device state dashboard
- GraphQL Query: deviceStates
- GraphQL Subscription: deviceStateChanged
- Auto-updating relative timestamps
- Visual state indicators (ON/OFF)
- Statistics bar
```

#### EventList Component
```typescript
// Event timeline display
- GraphQL Query: events
- GraphQL Subscription: eventIngested
- Chronological event display
- JSON payload rendering
```

**Data Flow:**
1. Component mounts → Relay executes GraphQL query
2. WebSocket subscription established
3. Server sends updates via subscription
4. Relay updates normalized store
5. Component re-renders with new data

### 2. GraphQL API Server

**Location:** `backend/`

**Technologies:**
- Apollo Server 4.9.3
- GraphQL 16.8.1
- Express.js
- Mongoose (MongoDB ODM)
- WebSocket support

**Schema Structure:**
```graphql
type Event {
  id: ID!
  eventType: String!
  timestamp: String!
  payload: JSON!
}

type DeviceState {
  id: ID!
  entityId: String!
  currentState: String!
  friendlyName: String
  lastChanged: String!
  lastEventId: String!
  attributes: JSON
  createdAt: String!
  updatedAt: String!
}

type Query {
  events: [Event!]!
  deviceStates: [DeviceState!]!
  deviceState(entityId: String!): DeviceState
}

type Mutation {
  ingestEvent(eventType: String!, payload: JSON!): Event!
}

type Subscription {
  eventIngested: Event!
  deviceStateChanged: DeviceState!
}
```

**Resolvers:**
- **Queries:** Fetch data from MongoDB
- **Mutations:** Insert events, trigger processing
- **Subscriptions:** Real-time updates via WebSocket

### 3. Event Processor Service

**Location:** `event-processor/`

**Technologies:**
- Node.js
- TypeScript
- MongoDB Change Streams
- Mongoose

**Core Components:**

#### EventProcessor
```typescript
class EventProcessor {
  // Watches MongoDB Change Streams
  // Dispatches events to projections
  // Handles errors and recovery
  // Manages resume tokens
}
```

#### Projection Framework
```typescript
interface IProjection {
  name: string;
  eventTypes: string[]; // Which events to process
  process(event: ProcessedEvent): Promise<void>;
  onError?(error: Error, event: ProcessedEvent): Promise<void>;
}
```

#### DeviceStateProjection
```typescript
class DeviceStateProjection implements IProjection {
  eventTypes = ["DEHUMIDIFIER"]; // Extensible
  
  async process(event: ProcessedEvent): Promise<void> {
    // Extract device info from event
    // Upsert device state in MongoDB
    // Publish GraphQL subscription
  }
}
```

### 4. MongoDB Database

**Configuration:**
- Replica Set: `rs0` (required for Change Streams)
- Authentication: Username/password
- Collections: `events`, `devicestates`

**Change Streams:**
```javascript
// Watches for new events
const changeStream = db.collection('events').watch([
  { $match: { operationType: 'insert' } }
]);

changeStream.on('change', (change) => {
  // Process new event
});
```

## Data Flow Architecture

### Event Ingestion Flow

```
1. Client/Home Assistant
   ↓ GraphQL Mutation
2. GraphQL Server
   ↓ Save to MongoDB
3. MongoDB (events collection)
   ↓ Change Stream notification
4. Event Processor
   ↓ Process event
5. Projections (DeviceStateProjection)
   ↓ Update derived state
6. MongoDB (devicestates collection)
   ↓ GraphQL Subscription
7. GraphQL Server
   ↓ WebSocket message
8. Frontend (Relay)
   ↓ Update UI
9. React Components
```

### Real-Time Update Flow

```
Event State Change
    ↓
MongoDB Change Stream
    ↓
Event Processor
    ↓
DeviceStateProjection.process()
    ↓
MongoDB Upsert (devicestates)
    ↓
GraphQL Subscription: deviceStateChanged
    ↓
WebSocket to Frontend
    ↓
Relay Store Update
    ↓
React Re-render
    ↓
UI Updates (< 1 second)
```

## Extension Points

### 1. Adding New Event Types

**Step 1:** Update DeviceStateProjection
```typescript
// event-processor/src/projections/DeviceStateProjection.ts
export class DeviceStateProjection implements IProjection {
  eventTypes = [
    "DEHUMIDIFIER",
    "LIGHT",           // ← Add new types
    "SWITCH",          // ← Add new types
    "SENSOR"           // ← Add new types
  ];
}
```

**Step 2:** Restart Processor
```bash
docker-compose restart event-processor
```

### 2. Creating New Projections

**Step 1:** Create Projection Class
```typescript
// event-processor/src/projections/EnergyProjection.ts
import { IProjection, ProcessedEvent } from "../types";

export class EnergyProjection implements IProjection {
  name = "EnergyProjection";
  eventTypes = ["DEHUMIDIFIER"]; // or ["*"] for all events

  async process(event: ProcessedEvent): Promise<void> {
    const { entity_id, payload } = event.payload;
    
    // Extract energy data
    const energyReading = payload.energy_reading;
    
    // Update energy collection
    await this.updateEnergyConsumption(entity_id, energyReading);
  }

  private async updateEnergyConsumption(entityId: string, energy: number) {
    // Your energy tracking logic
  }
}
```

**Step 2:** Register in Processor
```typescript
// event-processor/src/index.ts
import { EnergyProjection } from "./projections/EnergyProjection";

const energyProjection = new EnergyProjection();
const processor = new EventProcessor([
  deviceStateProjection,
  energyProjection, // ← Add here
]);
```

**Step 3:** Add GraphQL Types (if needed)
```graphql
# backend/schema.graphql
type EnergyConsumption {
  id: ID!
  entityId: String!
  totalEnergy: Float!
  lastReading: Float!
  lastUpdated: String!
}

extend type Query {
  energyConsumption(entityId: String!): EnergyConsumption
}
```

### 3. Adding New GraphQL Operations

**Step 1:** Update Schema
```graphql
# backend/schema.graphql
extend type Query {
  deviceHistory(entityId: String!, limit: Int): [Event!]!
}

extend type Mutation {
  updateDeviceName(entityId: String!, name: String!): DeviceState!
}
```

**Step 2:** Add Resolvers
```typescript
// backend/src/resolvers.ts
export const resolvers = {
  Query: {
    // ... existing resolvers
    deviceHistory: async (_, { entityId, limit = 10 }) => {
      return await Event.find({ 
        'payload.entity_id': entityId 
      }).limit(limit).sort({ timestamp: -1 });
    }
  },
  
  Mutation: {
    // ... existing mutations
    updateDeviceName: async (_, { entityId, name }) => {
      // Update device friendly name
    }
  }
};
```

**Step 3:** Sync Frontend Schema
```bash
./sync-frontend-schema.sh
```

### 4. Frontend Component Extensions

**Adding New Components:**
```typescript
// frontend/src/components/EnergyDashboard.tsx
import { graphql } from 'react-relay';

const EnergyDashboard = () => {
  // GraphQL query for energy data
  // Component logic
  // Real-time updates via subscription
};

export default EnergyDashboard;
```

**Adding to App Layout:**
```typescript
// frontend/src/App.tsx
import EnergyDashboard from './components/EnergyDashboard';

function App() {
  return (
    <div className="app">
      <DeviceStateList />
      <EventList />
      <EnergyDashboard /> {/* ← Add new component */}
    </div>
  );
}
```

## Performance Considerations

### 1. MongoDB Optimization

**Indexes:**
```javascript
// Recommended indexes
db.events.createIndex({ "timestamp": -1 });
db.events.createIndex({ "eventType": 1 });
db.events.createIndex({ "payload.entity_id": 1 });

db.devicestates.createIndex({ "entityId": 1 }, { unique: true });
db.devicestates.createIndex({ "currentState": 1 });
```

**Change Stream Optimization:**
- Resume tokens for fault tolerance
- Batch processing for high-volume events
- Connection pooling

### 2. Frontend Performance

**Relay Optimizations:**
- Normalized store for efficient updates
- Query batching
- Connection pagination for large datasets

**React Optimizations:**
- Component memoization
- Efficient re-rendering
- Time update intervals (10 seconds, not 1 second)

### 3. Real-Time Performance

**WebSocket Management:**
- Connection pooling
- Automatic reconnection
- Message queuing during disconnection

**Subscription Efficiency:**
- Only subscribe to necessary data
- Update existing records in place
- Avoid unnecessary network requests

## Security Considerations

### 1. Authentication & Authorization

**Current State:** Basic setup (can be extended)
```typescript
// Future: Add JWT authentication
const authMiddleware = (req, res, next) => {
  // Verify JWT token
  // Check user permissions
};
```

### 2. Data Validation

**GraphQL Schema Validation:**
```graphql
type Mutation {
  ingestEvent(
    eventType: String! @constraint(minLength: 1, maxLength: 50)
    payload: JSON! @constraint(required: true)
  ): Event!
}
```

**Input Sanitization:**
```typescript
// Sanitize event payloads
const sanitizePayload = (payload: any) => {
  // Remove dangerous fields
  // Validate data types
  // Size limits
};
```

### 3. MongoDB Security

**Connection Security:**
- Username/password authentication
- Replica set with keyfile
- Network isolation in Docker

## Monitoring & Observability

### 1. Logging

**Structured Logging:**
```typescript
// Event Processor logs
[EventProcessor] Processing event: DEHUMIDIFIER (67301234567890abcdef)
[DeviceStateProjection] Updated device state: switch.shellyplus1pm_fce8c0fdc4e0_switch_0 -> on
```

**Log Levels:**
- INFO: Normal operations
- WARN: Recoverable errors
- ERROR: Processing failures
- DEBUG: Detailed debugging

### 2. Health Checks

**Docker Health Checks:**
```yaml
# docker-compose.yaml
healthcheck:
  test: mongosh --username ${MONGODB_USER} --password ${MONGODB_PASS} --eval "db.adminCommand('ping')"
  interval: 5s
  timeout: 10s
  retries: 5
```

### 3. Metrics (Future)

**Potential Metrics:**
- Events processed per second
- Processing latency
- Error rates
- Database connection health
- WebSocket connection count

## Deployment Architecture

### 1. Docker Compose (Current)

**Services:**
- `graphql-server`: API layer
- `frontend`: Web interface
- `mongodb`: Database
- `event-processor`: Background processing
- `homeassistant`: Device integration

### 2. Production Considerations

**Scaling:**
- Multiple GraphQL server instances
- Load balancer (nginx/traefik)
- MongoDB replica set with multiple nodes
- Event processor horizontal scaling

**High Availability:**
- Database replication
- Service redundancy
- Health checks and auto-restart
- Backup strategies

### 3. Environment Configuration

**Environment Variables:**
```bash
# .env
MONGODB_USER=admin
MONGODB_PASS=secure_password
NODE_ENV=production
LOG_LEVEL=info
```

## Migration Paths

### 1. From MongoDB Change Streams to Message Queue

**When to Migrate:**
- High event volume (>10k events/second)
- Multiple event sources
- Complex routing requirements
- Need for dead letter queues

**Migration Strategy:**
1. Introduce RabbitMQ/Kafka alongside Change Streams
2. Dual-write to both systems
3. Migrate projections one by one
4. Deprecate Change Stream processing

### 2. Adding Event Sourcing

**Current State:** Event storage + projections
**Future State:** Full event sourcing with replay capability

**Benefits:**
- Complete audit trail
- Point-in-time state reconstruction
- Event replay for testing
- Temporal queries

## Testing Strategy

### 1. Unit Tests

**Components to Test:**
- Projection logic
- GraphQL resolvers
- Utility functions
- Data transformations

### 2. Integration Tests

**Test Scenarios:**
- End-to-end event processing
- GraphQL API functionality
- Real-time subscriptions
- Database operations

### 3. Load Testing

**Performance Tests:**
- Event ingestion throughput
- Concurrent user connections
- Database performance under load
- Memory usage patterns

## Future Enhancements

### 1. Advanced Projections

**Saga Engine:**
```typescript
// Complex workflows
class AutomationSaga implements ISaga {
  async handle(event: ProcessedEvent): Promise<void> {
    // Multi-step automation logic
    // State machine implementation
    // Compensation actions
  }
}
```

**Event Replay:**
```typescript
// Rebuild projections from history
class ProjectionReplay {
  async replayFromTimestamp(timestamp: Date): Promise<void> {
    // Replay events from specific point
    // Rebuild all projections
  }
}
```

### 2. Advanced Analytics

**Time Series Data:**
- Device usage patterns
- Energy consumption trends
- Predictive analytics
- Anomaly detection

**Real-Time Dashboards:**
- Custom metrics
- Historical comparisons
- Alert systems
- Reporting

### 3. Multi-Tenant Support

**Tenant Isolation:**
- Database per tenant
- API key authentication
- Resource quotas
- Isolated processing

---

This architecture provides a solid foundation for real-time event processing while maintaining flexibility for future enhancements. The modular design allows for easy extension and scaling as requirements grow.


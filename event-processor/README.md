# Timelines Event Processor

This is the event processing service for the Timelines application. It listens to MongoDB change streams for new events and processes them through various projections.

## Architecture

The event processor uses a projection-based architecture:

- **EventProcessor**: Main orchestrator that watches for new events
- **Projections**: Event handlers that process specific event types
- **Models**: Shared MongoDB models for Event and DeviceState

## Current Projections

- **DeviceStateProjection**: Processes device state change events (currently DEHUMIDIFIER events)

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Docker

```bash
# Build image
docker build -t timelines-event-processor .

# Run container
docker run --rm \
  -e MONGODB_URI=mongodb://localhost:27017/timelines \
  -e MONGODB_USER=your_user \
  -e MONGODB_PASS=your_pass \
  timelines-event-processor
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (required)
- `MONGODB_USER`: MongoDB username (optional)
- `MONGODB_PASS`: MongoDB password (optional)

## Adding New Projections

1. Create a new projection class in `src/projections/`
2. Implement the `IProjection` interface
3. Register it in `src/index.ts`
4. Add the event types you want to handle to the `eventTypes` array

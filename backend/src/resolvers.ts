import { Event } from "./models/Event";
import { DeviceState } from "./models/DeviceState";
import { DehumidifierRun } from "./models/DehumidifierRun";
import { PubSub } from "graphql-subscriptions";

interface IngestEventArgs {
  eventType: string;
  payload?: string;
}

interface DeviceStateArgs {
  entityId: string;
}

interface DehumidifierRunArgs {
  id: string;
}

const EVENT_INGESTED = "EVENT_INGESTED";
const DEVICE_STATE_CHANGED = "DEVICE_STATE_CHANGED";
const DEHUMIDIFIER_RUN_CHANGED = "DEHUMIDIFIER_RUN_CHANGED";

export const pubsub = new PubSub();

export const resolvers = {
  Query: {
    events: async () => {
      return await Event.find({});
    },
    deviceStates: async () => {
      return await DeviceState.find({});
    },
    deviceState: async (_: unknown, { entityId }: DeviceStateArgs) => {
      return await DeviceState.findOne({ entityId });
    },
    dehumidifierRuns: async () => {
      return await DehumidifierRun.find({}).sort({ startTime: -1 });
    },
    dehumidifierRun: async (_: unknown, { id }: DehumidifierRunArgs) => {
      return await DehumidifierRun.findById(id);
    },
  },
  Mutation: {
    ingestEvent: async (
      _: unknown,
      { eventType, payload }: IngestEventArgs
    ) => {
      console.log("Ingesting event:", { eventType, payload });
      let parsedPayload: any = payload;
      if (typeof payload === "string") {
        try {
          parsedPayload = JSON.parse(payload);
        } catch (e) {
          parsedPayload = payload; // fallback to string if not valid JSON
        }
      }
      const event = new Event({
        eventType,
        timestamp: new Date().toISOString(),
        payload: parsedPayload,
      });
      await event.save();

      // Publish the event to subscribers
      pubsub.publish(EVENT_INGESTED, { eventIngested: event });

      return event;
    },
  },
  Subscription: {
    eventIngested: {
      subscribe: () => {
        console.log("[Subscription] Client subscribed to eventIngested");
        return pubsub.asyncIterableIterator([EVENT_INGESTED]);
      },
    },
    deviceStateChanged: {
      subscribe: () => {
        console.log("[Subscription] Client subscribed to deviceStateChanged");
        return pubsub.asyncIterableIterator([DEVICE_STATE_CHANGED]);
      },
    },
    dehumidifierRunChanged: {
      subscribe: () => {
        console.log(
          "[Subscription] Client subscribed to dehumidifierRunChanged"
        );
        return pubsub.asyncIterableIterator([DEHUMIDIFIER_RUN_CHANGED]);
      },
    },
  },
};

import { Event } from "./models/Event";
import { PubSub } from "graphql-subscriptions";

interface IngestEventArgs {
  eventType: string;
  payload?: string;
}

const EVENT_INGESTED = "EVENT_INGESTED";

export const pubsub = new PubSub();

export const resolvers = {
  Query: {
    events: async () => {
      return await Event.find({});
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
      subscribe: () => pubsub.asyncIterableIterator([EVENT_INGESTED]),
    },
  },
};

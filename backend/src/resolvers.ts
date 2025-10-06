import { Event } from "./models/Event";

interface IngestEventArgs {
  eventType: string;
  payload?: string;
}

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
      return event;
    },
  },
};

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
      const event = new Event({
        eventType,
        timestamp: new Date().toISOString(),
        payload,
      });
      await event.save();
      return event;
    },
  },
};

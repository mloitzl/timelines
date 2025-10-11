import { graphql } from "react-relay";
import { useLazyLoadQuery, useSubscription } from "react-relay";
import type { EventListQuery } from "../__generated__/EventListQuery.graphql";
import type { GraphQLSubscriptionConfig } from "relay-runtime";

export const EventListQueryTag = graphql`
  query EventListQuery {
    events {
      id
      eventType
      timestamp
      payload
    }
  }
`;

const EventIngestedSubscription = graphql`
  subscription EventListSubscription {
    eventIngested {
      id
      eventType
      timestamp
      payload
    }
  }
`;

export function EventList() {
  const data = useLazyLoadQuery<EventListQuery>(EventListQueryTag, {});

  // Subscribe to new events
  const subscriptionConfig: GraphQLSubscriptionConfig<any> = {
    subscription: EventIngestedSubscription,
    variables: {},
    updater: (store) => {
      const newEvent = store.getRootField("eventIngested");
      if (newEvent) {
        const root = store.getRoot();
        const events = root.getLinkedRecords("events") || [];
        root.setLinkedRecords([newEvent, ...events], "events");
      }
    },
  };

  useSubscription(subscriptionConfig);

  const sortedEvents = [...(data.events || [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="event-list">
      <h2>Event Timeline</h2>
      {sortedEvents.map((event) => (
        <div key={event.id} className="event-item">
          <h3>{event.eventType}</h3>
          <time>{new Date(event.timestamp).toLocaleString()}</time>
          <pre>{JSON.stringify(event.payload, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}

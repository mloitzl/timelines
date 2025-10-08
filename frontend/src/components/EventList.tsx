import { graphql } from "react-relay";
import { useLazyLoadQuery } from "react-relay";
import type { EventListQuery } from "../__generated__/EventListQuery.graphql";

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

export function EventList() {
  const data = useLazyLoadQuery<EventListQuery>(EventListQueryTag, {});

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

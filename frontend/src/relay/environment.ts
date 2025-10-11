import {
  Environment,
  Network,
  RecordSource,
  Store,
  Observable,
} from "relay-runtime";
import { createClient } from "graphql-ws";

async function fetchGraphQL(params: any, variables: Record<string, unknown>) {
  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: params.text, // Use params.text instead of query
      variables,
    }),
  });

  const json = await response.json();

  // Check for errors
  if (Array.isArray(json.errors)) {
    console.error("GraphQL Errors:", json.errors);
  }

  return json;
}

// Create WebSocket client for subscriptions with retry logic
const wsClient = createClient({
  url: "ws://localhost:4000/graphql",
  retryAttempts: Infinity,
  shouldRetry: () => true,
  connectionParams: async () => {
    return {};
  },
});

function subscribeGraphQL(request: any, variables: Record<string, unknown>) {
  return Observable.create((sink) => {
    return wsClient.subscribe(
      {
        query: request.text,
        variables,
      },
      {
        next: (data) => sink.next(data),
        error: (error) => sink.error(error),
        complete: () => sink.complete(),
      }
    );
  });
}

export const RelayEnvironment = new Environment({
  network: Network.create(fetchGraphQL, subscribeGraphQL),
  store: new Store(new RecordSource()),
});

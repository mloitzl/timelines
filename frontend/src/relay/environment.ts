import {
  Environment,
  Network,
  RecordSource,
  Store,
  Observable,
} from "relay-runtime";
import { createClient } from "graphql-ws";

// Use environment variables with fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/graphql";
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000/graphql";

async function fetchGraphQL(params: any, variables: Record<string, unknown>) {
  const response = await fetch(API_URL, {
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
  url: WS_URL,
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

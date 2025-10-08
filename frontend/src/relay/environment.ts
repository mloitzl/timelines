import { Environment, Network, RecordSource, Store } from "relay-runtime";

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

export const RelayEnvironment = new Environment({
  network: Network.create(fetchGraphQL),
  store: new Store(new RecordSource()),
});

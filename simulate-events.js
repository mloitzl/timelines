#!/usr/bin/env node

const GRAPHQL_URL = "http://localhost:4000/graphql";

async function sendEvent(eventData) {
  const mutation = `
    mutation IngestEvent($eventType: String!, $payload: JSON) {
      ingestEvent(eventType: $eventType, payload: $payload) {
        id
        eventType
        timestamp
        payload
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: mutation,
      variables: eventData,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL Errors:", result.errors);
    throw new Error("Failed to send event");
  }

  return result.data.ingestEvent;
}

async function simulateDehumidifierCycle() {
  console.log("🔌 Starting dehumidifier simulation...\n");

  // Event 1: Dehumidifier turning ON
  const event1 = {
    eventType: "DEHUMIDIFIER",
    payload: {
      energy_reading: 40.914732,
      energy_unit: "kWh",
      entity_id: "switch.shellyplus1pm_fce8c0fdc4e0_switch_0",
      from_attributes: {
        friendly_name: "Dehumidifier",
      },
      from_last_changed: new Date(Date.now() - 156000).toISOString(), // ~2.5 min ago
      from_state: "off",
      to_attributes: {
        friendly_name: "Dehumidifier",
      },
      to_last_changed: new Date().toISOString(),
      to_state: "on",
    },
  };

  console.log("📤 Sending event: Dehumidifier turning ON");
  console.log(
    "   Energy reading:",
    event1.payload.energy_reading,
    event1.payload.energy_unit
  );
  const result1 = await sendEvent(event1);
  console.log("✅ Event ingested:", result1.id);
  console.log("   Timestamp:", result1.timestamp);

  console.log("\n⏳ Waiting 5 seconds...\n");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Event 2: Dehumidifier turning OFF
  const event2 = {
    eventType: "DEHUMIDIFIER",
    payload: {
      energy_reading: 41.32,
      energy_unit: "kWh",
      entity_id: "switch.shellyplus1pm_fce8c0fdc4e0_switch_0",
      from_attributes: {
        friendly_name: "Dehumidifier",
      },
      from_last_changed: event1.payload.to_last_changed,
      from_state: "on",
      to_attributes: {
        friendly_name: "Dehumidifier",
      },
      to_last_changed: new Date().toISOString(),
      to_state: "off",
    },
  };

  const energyConsumed = (
    event2.payload.energy_reading - event1.payload.energy_reading
  ).toFixed(6);

  console.log("📤 Sending event: Dehumidifier turning OFF");
  console.log(
    "   Energy reading:",
    event2.payload.energy_reading,
    event2.payload.energy_unit
  );
  console.log("   Energy consumed:", energyConsumed, "kWh");
  const result2 = await sendEvent(event2);
  console.log("✅ Event ingested:", result2.id);
  console.log("   Timestamp:", result2.timestamp);

  console.log("\n✨ Simulation complete!\n");
}

// Run the simulation
simulateDehumidifierCycle().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});

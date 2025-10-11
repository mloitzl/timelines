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

async function simulateNameChange() {
  console.log("✏️  Starting name change simulation...\n");

  // Get the timestamp for when the device last changed state (simulating it was a while ago)
  const lastStateChange = new Date(Date.now() - 77000).toISOString(); // ~1.3 min ago

  // Event: Friendly name change from "Entfeuchter" to "Dehumidifier"
  const event = {
    eventType: "DEHUMIDIFIER",
    payload: {
      energy_reading: 40.914767,
      energy_unit: "kWh",
      entity_id: "switch.shellyplus1pm_fce8c0fdc4e0_switch_0",
      from_attributes: {
        friendly_name: "Entfeuchter", // German name
      },
      from_last_changed: lastStateChange,
      from_state: "off",
      to_attributes: {
        friendly_name: "Dehumidifier", // English name
      },
      to_last_changed: lastStateChange, // Same timestamp since state didn't change
      to_state: "off",
    },
  };

  console.log("📤 Sending event: Name change");
  console.log('   From: "Entfeuchter" → To: "Dehumidifier"');
  console.log("   State: off (unchanged)");
  console.log(
    "   Energy reading:",
    event.payload.energy_reading,
    event.payload.energy_unit
  );

  const result = await sendEvent(event);
  console.log("\n✅ Event ingested:", result.id);
  console.log("   Timestamp:", result.timestamp);

  console.log("\n✨ Name change recorded!\n");
}

// Run the simulation
simulateNameChange().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});

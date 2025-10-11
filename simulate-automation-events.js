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

async function simulateAutomationCycle() {
  console.log("🤖 Starting automation state change simulation...\n");

  // Event 1: Automation being disabled (button pressed)
  const disableTime = new Date();
  const event1 = {
    eventType: "DEHUMIDIFIER_AUTOMATION",
    payload: {
      entity_id: "automation.dehumidifier_control_by_humidity",
      from_state: "on",
      to_state: "off",
      from_last_changed: new Date(
        disableTime.getTime() - 3600000
      ).toISOString(), // Was on for 1 hour
      to_last_changed: disableTime.toISOString(),
      trigger_id: "automation_disabled",
      automation_name: "Dehumidifier Control by Humidity",
    },
  };

  console.log("📤 Sending event: Automation DISABLED");
  console.log("   Trigger: Button push (single_push)");
  console.log("   Duration disabled: 1 hour");
  const result1 = await sendEvent(event1);
  console.log("✅ Event ingested:", result1.id);
  console.log("   Timestamp:", result1.timestamp);

  console.log("\n⏳ Waiting 3 seconds (simulating 1 hour delay)...\n");
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Event 2: Automation being re-enabled (after 1 hour)
  const enableTime = new Date();
  const event2 = {
    eventType: "DEHUMIDIFIER_AUTOMATION",
    payload: {
      entity_id: "automation.dehumidifier_control_by_humidity",
      from_state: "off",
      to_state: "on",
      from_last_changed: disableTime.toISOString(),
      to_last_changed: enableTime.toISOString(),
      trigger_id: "automation_enabled",
      automation_name: "Dehumidifier Control by Humidity",
    },
  };

  const disabledDuration = Math.round((enableTime - disableTime) / 1000);

  console.log("📤 Sending event: Automation ENABLED");
  console.log("   Trigger: Automatic re-enable after delay");
  console.log(`   Was disabled for: ${disabledDuration} seconds`);
  const result2 = await sendEvent(event2);
  console.log("✅ Event ingested:", result2.id);
  console.log("   Timestamp:", result2.timestamp);

  console.log("\n✨ Automation cycle simulation complete!\n");
}

// Run the simulation
simulateAutomationCycle().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});

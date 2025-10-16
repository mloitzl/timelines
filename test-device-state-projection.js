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

async function getDeviceStates() {
  const query = `
    query GetDeviceStates {
      deviceStates {
        id
        entityId
        currentState
        friendlyName
        lastChanged
        lastEventId
        attributes
        createdAt
        updatedAt
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL Errors:", result.errors);
    throw new Error("Failed to get device states");
  }

  return result.data.deviceStates;
}

async function getDeviceState(entityId) {
  const query = `
    query GetDeviceState($entityId: String!) {
      deviceState(entityId: $entityId) {
        id
        entityId
        currentState
        friendlyName
        lastChanged
        lastEventId
        attributes
        createdAt
        updatedAt
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { entityId },
    }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL Errors:", result.errors);
    throw new Error("Failed to get device state");
  }

  return result.data.deviceState;
}

async function testDeviceStateProjection() {
  console.log("🧪 Testing Device State Projection\n");

  const entityId = "switch.shellyplus1pm_fce8c0fdc4e0_switch_0";

  // Test 1: Send event turning device ON
  console.log("📤 Test 1: Sending event - Dehumidifier turning ON");
  const event1 = {
    eventType: "DEHUMIDIFIER",
    payload: {
      energy_reading: 40.5,
      energy_unit: "kWh",
      entity_id: entityId,
      from_attributes: {
        friendly_name: "Dehumidifier",
      },
      from_last_changed: new Date(Date.now() - 60000).toISOString(),
      from_state: "off",
      to_attributes: {
        friendly_name: "Dehumidifier",
      },
      to_last_changed: new Date().toISOString(),
      to_state: "on",
    },
  };

  await sendEvent(event1);
  console.log("✅ Event sent\n");

  // Wait for projection to process
  console.log("⏳ Waiting 2 seconds for projection to process...\n");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test 2: Query device state
  console.log("🔍 Test 2: Querying device state");
  const deviceState1 = await getDeviceState(entityId);

  if (!deviceState1) {
    console.error("❌ Device state not found!");
    process.exit(1);
  }

  console.log("✅ Device state found:");
  console.log("   Entity ID:", deviceState1.entityId);
  console.log("   Current State:", deviceState1.currentState);
  console.log("   Friendly Name:", deviceState1.friendlyName);
  console.log("   Last Changed:", deviceState1.lastChanged);

  if (deviceState1.currentState !== "on") {
    console.error(`❌ Expected state 'on', got '${deviceState1.currentState}'`);
    process.exit(1);
  }
  console.log("✅ State is correctly 'on'\n");

  // Test 3: Send event turning device OFF
  console.log("📤 Test 3: Sending event - Dehumidifier turning OFF");
  const event2 = {
    eventType: "DEHUMIDIFIER",
    payload: {
      energy_reading: 41.2,
      energy_unit: "kWh",
      entity_id: entityId,
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

  await sendEvent(event2);
  console.log("✅ Event sent\n");

  // Wait for projection to process
  console.log("⏳ Waiting 2 seconds for projection to process...\n");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test 4: Query device state again
  console.log("🔍 Test 4: Querying updated device state");
  const deviceState2 = await getDeviceState(entityId);

  console.log("✅ Device state found:");
  console.log("   Entity ID:", deviceState2.entityId);
  console.log("   Current State:", deviceState2.currentState);
  console.log("   Friendly Name:", deviceState2.friendlyName);
  console.log("   Last Changed:", deviceState2.lastChanged);

  if (deviceState2.currentState !== "off") {
    console.error(
      `❌ Expected state 'off', got '${deviceState2.currentState}'`
    );
    process.exit(1);
  }
  console.log("✅ State is correctly 'off'\n");

  // Test 5: Query all device states
  console.log("🔍 Test 5: Querying all device states");
  const allStates = await getDeviceStates();
  console.log(`✅ Found ${allStates.length} device state(s):`);
  allStates.forEach((state) => {
    console.log(
      `   - ${state.friendlyName} (${state.entityId}): ${state.currentState}`
    );
  });

  console.log(
    "\n✨ All tests passed! Device State Projection is working correctly.\n"
  );
}

// Run the test
testDeviceStateProjection().catch((error) => {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
});

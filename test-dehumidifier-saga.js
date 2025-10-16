#!/usr/bin/env node

/**
 * Test script for DehumidifierRunSaga
 *
 * This script simulates a complete dehumidifier run cycle:
 * 1. Dehumidifier turns ON (starts saga)
 * 2. Wait a few seconds (simulating running time)
 * 3. Dehumidifier turns OFF (ends saga)
 *
 * The saga should track:
 * - Start time, end time, duration
 * - Energy consumption (difference between start and end readings)
 * - Whether it was started by automation or manual
 * - Real-time updates in the UI
 */

// Using built-in fetch (Node.js 18+)

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";

async function sendEvent(eventData) {
  const query = `
    mutation Mutation($eventType: String!, $payload: JSON) {
      ingestEvent(eventType: $eventType, payload: $payload) {
        id
        eventType
        timestamp
        payload
      }
    }
  `;

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        eventType: eventData.eventType,
        payload: eventData.payload,
      },
    }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error("GraphQL mutation failed");
  }

  return result.data.ingestEvent;
}

async function queryDehumidifierRuns() {
  const query = `
    query {
      dehumidifierRuns {
        id
        entityId
        status
        startTime
        endTime
        duration
        startEnergyReading
        endEnergyReading
        energyConsumed
        energyUnit
        startedBy
        humidityThreshold
        startEventId
        endEventId
        errorMessage
        createdAt
        updatedAt
      }
    }
  `;

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error("GraphQL query failed");
  }

  return result.data.dehumidifierRuns;
}

async function simulateDehumidifierSaga() {
  console.log("🌊 Starting DehumidifierRunSaga test...\n");

  // Initial state - check if there are any existing runs
  console.log("📊 Checking initial state...");
  const initialRuns = await queryDehumidifierRuns();
  console.log(`Found ${initialRuns.length} existing dehumidifier runs`);

  // Step 1: Dehumidifier turns ON (starts saga)
  const startTime = new Date();
  const startEnergyReading = 40.914732;

  const startEvent = {
    eventType: "DEHUMIDIFIER",
    payload: {
      energy_reading: startEnergyReading,
      energy_unit: "kWh",
      entity_id: "switch.shellyplus1pm_fce8c0fdc4e0_switch_0",
      from_attributes: {
        friendly_name: "Dehumidifier",
      },
      from_last_changed: new Date(startTime.getTime() - 1000).toISOString(),
      from_state: "off",
      to_attributes: {
        friendly_name: "Dehumidifier",
      },
      to_last_changed: startTime.toISOString(),
      to_state: "on",
    },
  };

  console.log("📤 Sending event: Dehumidifier turning ON");
  console.log(
    `   Energy reading: ${startEvent.payload.energy_reading} ${startEvent.payload.energy_unit}`
  );
  const startResult = await sendEvent(startEvent);
  console.log("✅ Event ingested:", startResult.id);
  console.log("   Timestamp:", startResult.timestamp);

  // Wait a moment for the saga to be created
  console.log("\n⏳ Waiting 2 seconds for saga to be created...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check that the saga was created
  const runsAfterStart = await queryDehumidifierRuns();
  const newRun = runsAfterStart.find(
    (run) => run.startEventId === startResult.id
  );

  if (newRun) {
    console.log("✅ Saga created successfully!");
    console.log(`   Run ID: ${newRun.id}`);
    console.log(`   Status: ${newRun.status}`);
    console.log(`   Started by: ${newRun.startedBy}`);
    console.log(
      `   Start energy: ${newRun.startEnergyReading} ${newRun.energyUnit}`
    );
  } else {
    console.log("❌ Saga was not created!");
    return;
  }

  // Step 2: Simulate running time
  const runDuration = 5000; // 5 seconds
  console.log(
    `\n⏳ Simulating dehumidifier running for ${runDuration / 1000} seconds...`
  );
  await new Promise((resolve) => setTimeout(resolve, runDuration));

  // Step 3: Dehumidifier turns OFF (ends saga)
  const endTime = new Date();
  const endEnergyReading = startEnergyReading + 0.001234; // Simulate energy consumption

  const endEvent = {
    eventType: "DEHUMIDIFIER",
    payload: {
      energy_reading: endEnergyReading,
      energy_unit: "kWh",
      entity_id: "switch.shellyplus1pm_fce8c0fdc4e0_switch_0",
      from_attributes: {
        friendly_name: "Dehumidifier",
      },
      from_last_changed: startTime.toISOString(),
      from_state: "on",
      to_attributes: {
        friendly_name: "Dehumidifier",
      },
      to_last_changed: endTime.toISOString(),
      to_state: "off",
    },
  };

  const energyConsumed = endEnergyReading - startEnergyReading;

  console.log("📤 Sending event: Dehumidifier turning OFF");
  console.log(
    `   Energy reading: ${endEvent.payload.energy_reading} ${endEvent.payload.energy_unit}`
  );
  console.log(`   Energy consumed: ${energyConsumed.toFixed(6)} kWh`);
  const endResult = await sendEvent(endEvent);
  console.log("✅ Event ingested:", endResult.id);
  console.log("   Timestamp:", endResult.timestamp);

  // Wait a moment for the saga to be completed
  console.log("\n⏳ Waiting 2 seconds for saga to be completed...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check that the saga was completed
  const finalRuns = await queryDehumidifierRuns();
  const completedRun = finalRuns.find((run) => run.id === newRun.id);

  if (completedRun && completedRun.status === "finished") {
    console.log("✅ Saga completed successfully!");
    console.log(`   Status: ${completedRun.status}`);
    console.log(
      `   Duration: ${completedRun.duration}ms (${Math.round(
        completedRun.duration / 1000
      )}s)`
    );
    console.log(
      `   Energy consumed: ${completedRun.energyConsumed} ${completedRun.energyUnit}`
    );
    console.log(
      `   Start energy: ${completedRun.startEnergyReading} ${completedRun.energyUnit}`
    );
    console.log(
      `   End energy: ${completedRun.endEnergyReading} ${completedRun.energyUnit}`
    );
  } else {
    console.log("❌ Saga was not completed properly!");
    console.log("   Final status:", completedRun?.status);
    console.log("   Error message:", completedRun?.errorMessage);
  }

  console.log("\n🎉 DehumidifierRunSaga test completed!");
  console.log("\n📊 Final state:");
  console.log(`Total dehumidifier runs: ${finalRuns.length}`);
  finalRuns.forEach((run, index) => {
    console.log(
      `  ${index + 1}. ${run.status} - ${
        run.duration ? Math.round(run.duration / 1000) + "s" : "running"
      } - ${
        run.energyConsumed ? run.energyConsumed.toFixed(6) + " kWh" : "N/A"
      }`
    );
  });
}

// Run the test
simulateDehumidifierSaga().catch((error) => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});

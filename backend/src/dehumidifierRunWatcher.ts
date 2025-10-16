import { DehumidifierRun } from "./models/DehumidifierRun";
import { pubsub } from "./resolvers";
import { ChangeStreamUpdateDocument } from "mongodb";

export function startDehumidifierRunWatcher() {
  try {
    console.log(
      "[DehumidifierRunWatcher] Starting dehumidifier run change watcher..."
    );

    const changeStream = DehumidifierRun.watch(
      [{ $match: { operationType: { $in: ["insert", "update", "replace"] } } }],
      {
        fullDocument: "updateLookup",
      }
    );

    changeStream.on("change", async (change: ChangeStreamUpdateDocument) => {
      try {
        if (change.fullDocument) {
          const dehumidifierRun = change.fullDocument as any;

          console.log(
            `[DehumidifierRunWatcher] Dehumidifier run changed: ${dehumidifierRun._id} -> ${dehumidifierRun.status}`
          );

          // Transform MongoDB document to GraphQL format
          // MongoDB uses _id, GraphQL expects id
          const graphqlDehumidifierRun = {
            id: dehumidifierRun._id.toString(),
            entityId: dehumidifierRun.entityId,
            status: dehumidifierRun.status,
            startTime: dehumidifierRun.startTime,
            endTime: dehumidifierRun.endTime,
            duration: dehumidifierRun.duration,
            startEnergyReading: dehumidifierRun.startEnergyReading,
            endEnergyReading: dehumidifierRun.endEnergyReading,
            energyConsumed: dehumidifierRun.energyConsumed,
            energyUnit: dehumidifierRun.energyUnit,
            startedBy: dehumidifierRun.startedBy,
            humidityThreshold: dehumidifierRun.humidityThreshold,
            startEventId: dehumidifierRun.startEventId,
            endEventId: dehumidifierRun.endEventId,
            errorMessage: dehumidifierRun.errorMessage,
            createdAt: dehumidifierRun.createdAt,
            updatedAt: dehumidifierRun.updatedAt,
          };

          // Publish to GraphQL subscribers
          console.log(
            "[DehumidifierRunWatcher] Publishing to DEHUMIDIFIER_RUN_CHANGED"
          );

          await pubsub.publish("DEHUMIDIFIER_RUN_CHANGED", {
            dehumidifierRunChanged: graphqlDehumidifierRun,
          });
          console.log("[DehumidifierRunWatcher] Published successfully");
        }
      } catch (error) {
        console.error("[DehumidifierRunWatcher] Error handling change:", error);
      }
    });

    changeStream.on("error", (error: Error) => {
      console.error("[DehumidifierRunWatcher] Change stream error:", error);
    });

    changeStream.on("close", () => {
      console.log("[DehumidifierRunWatcher] Change stream closed");
    });

    console.log(
      "[DehumidifierRunWatcher] Now watching for dehumidifier run changes..."
    );

    return changeStream;
  } catch (error) {
    console.error("[DehumidifierRunWatcher] Failed to start watcher:", error);
    throw error;
  }
}

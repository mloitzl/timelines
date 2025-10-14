import { DeviceState } from "./models/DeviceState";
import { pubsub } from "./resolvers";
import { ChangeStreamUpdateDocument } from "mongodb";

export function startDeviceStateWatcher() {
  try {
    console.log("[DeviceStateWatcher] Starting device state change watcher...");

    const changeStream = DeviceState.watch(
      [{ $match: { operationType: { $in: ["insert", "update", "replace"] } } }],
      {
        fullDocument: "updateLookup",
      }
    );

    changeStream.on("change", async (change: ChangeStreamUpdateDocument) => {
      try {
        if (change.fullDocument) {
          const deviceState = change.fullDocument as any;

          console.log(
            `[DeviceStateWatcher] Device state changed: ${deviceState.entityId} -> ${deviceState.currentState}`
          );

          // Transform MongoDB document to GraphQL format
          // MongoDB uses _id, GraphQL expects id
          const graphqlDeviceState = {
            id: deviceState._id.toString(),
            entityId: deviceState.entityId,
            currentState: deviceState.currentState,
            friendlyName: deviceState.friendlyName,
            lastChanged: deviceState.lastChanged,
            lastEventId: deviceState.lastEventId.toString(),
            attributes: deviceState.attributes,
            createdAt: deviceState.createdAt,
            updatedAt: deviceState.updatedAt,
          };

          // Publish to GraphQL subscribers
          console.log(
            "[DeviceStateWatcher] Publishing to DEVICE_STATE_CHANGED"
          );

          await pubsub.publish("DEVICE_STATE_CHANGED", {
            deviceStateChanged: graphqlDeviceState,
          });
          console.log("[DeviceStateWatcher] Published successfully");
        }
      } catch (error) {
        console.error("[DeviceStateWatcher] Error handling change:", error);
      }
    });

    changeStream.on("error", (error: Error) => {
      console.error("[DeviceStateWatcher] Change stream error:", error);
    });

    changeStream.on("close", () => {
      console.log("[DeviceStateWatcher] Change stream closed");
    });

    console.log(
      "[DeviceStateWatcher] Now watching for device state changes..."
    );

    return changeStream;
  } catch (error) {
    console.error("[DeviceStateWatcher] Failed to start watcher:", error);
    throw error;
  }
}

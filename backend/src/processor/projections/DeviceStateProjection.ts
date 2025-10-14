import { IProjection, ProcessedEvent } from "../types";
import { DeviceState } from "../../models/DeviceState";

export class DeviceStateProjection implements IProjection {
  name = "DeviceStateProjection";
  eventTypes = ["DEHUMIDIFIER"]; // Can add more device event types here

  async process(event: ProcessedEvent): Promise<void> {
    const { payload } = event;

    // Extract device state information from the event
    const entityId = payload.entity_id;
    const toState = payload.to_state;
    const toLastChanged = payload.to_last_changed;
    const toAttributes = payload.to_attributes || {};

    if (!entityId || !toState) {
      console.warn(
        `[${this.name}] Event ${event._id} missing required fields (entity_id or to_state)`
      );
      return;
    }

    // Upsert the device state
    const updatedDeviceState = await DeviceState.findOneAndUpdate(
      { entityId },
      {
        entityId,
        currentState: toState,
        friendlyName: toAttributes.friendly_name || entityId,
        lastChanged: toLastChanged || event.timestamp,
        lastEventId: event._id,
        attributes: toAttributes,
      },
      {
        upsert: true, // Create if doesn't exist
        new: true, // Return the updated document
      }
    );

    console.log(
      `[${this.name}] Updated device state: ${entityId} -> ${toState}`
    );

    // Note: GraphQL subscriptions are handled by the GraphQL server
    // which watches the devicestates collection for changes
  }

  async onError(error: Error, event: ProcessedEvent): Promise<void> {
    console.error(`[${this.name}] Error processing event ${event._id}:`, error);
    // Could implement retry logic, dead letter queue, etc.
  }
}

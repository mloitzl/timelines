export interface IProjection {
  name: string;
  eventTypes: string[]; // Event types this projection is interested in
  process(event: ProcessedEvent): Promise<void>;
  onError?(error: Error, event: ProcessedEvent): Promise<void>;
}

export interface ProcessedEvent {
  _id: string;
  eventType: string;
  timestamp: string;
  payload: any;
}

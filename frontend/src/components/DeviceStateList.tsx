import { graphql } from "react-relay";
import { useLazyLoadQuery, useSubscription } from "react-relay";
import type { DeviceStateListQuery } from "../__generated__/DeviceStateListQuery.graphql";
import type { GraphQLSubscriptionConfig } from "relay-runtime";
import { formatRelativeTime } from "../utils/timeUtils";
import { useState, useEffect } from "react";

export const DeviceStateListQueryTag = graphql`
  query DeviceStateListQuery {
    deviceStates {
      id
      entityId
      currentState
      friendlyName
      lastChanged
      lastEventId
      attributes
      updatedAt
    }
  }
`;

const DeviceStateChangedSubscription = graphql`
  subscription DeviceStateListSubscription {
    deviceStateChanged {
      id
      entityId
      currentState
      friendlyName
      lastChanged
      lastEventId
      attributes
      updatedAt
    }
  }
`;

interface DeviceState {
  id: string;
  entityId: string;
  currentState: string;
  friendlyName: string | null;
  lastChanged: string;
  lastEventId: string;
  attributes: any;
  updatedAt: string;
}

function DeviceCard({ device }: { device: DeviceState }) {
  const [relativeTime, setRelativeTime] = useState(
    formatRelativeTime(device.lastChanged)
  );

  // Update relative time every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(device.lastChanged));
    }, 10000);

    return () => clearInterval(interval);
  }, [device.lastChanged]);

  const isOn = device.currentState.toLowerCase() === "on";
  const displayName = device.friendlyName || device.entityId;

  return (
    <div className={`device-card ${isOn ? "device-on" : "device-off"}`}>
      <div className="device-header">
        <div className="device-status-indicator">
          <span className={`status-dot ${isOn ? "status-on" : "status-off"}`} />
        </div>
        <div className="device-info">
          <h3 className="device-name">{displayName}</h3>
          <p className="device-id">{device.entityId}</p>
        </div>
        <div className="device-state">
          <span className={`state-badge ${isOn ? "badge-on" : "badge-off"}`}>
            {device.currentState.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="device-footer">
        <div className="device-time">
          <svg
            className="time-icon"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="7"
              cy="7"
              r="6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M7 3.5V7L9.5 9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="time-text">{relativeTime}</span>
        </div>
      </div>
    </div>
  );
}

export function DeviceStateList() {
  const data = useLazyLoadQuery<DeviceStateListQuery>(
    DeviceStateListQueryTag,
    {}
  );

  // Subscribe to device state changes
  const subscriptionConfig: GraphQLSubscriptionConfig<any> = {
    subscription: DeviceStateChangedSubscription,
    variables: {},
    onNext: (response) => {
      console.log("[DeviceStateList] Received subscription update:", response);
    },
    onError: (error) => {
      console.error("[DeviceStateList] Subscription error:", error);
    },
    updater: (store) => {
      console.log("[DeviceStateList] Subscription updater called");
      const changedDevice = store.getRootField("deviceStateChanged");
      if (changedDevice) {
        const entityId = changedDevice.getValue("entityId");
        console.log("[DeviceStateList] Device changed:", entityId);
        const root = store.getRoot();
        const devices = root.getLinkedRecords("deviceStates") || [];

        // Find and update existing device, or add new one
        const existingIndex = devices.findIndex(
          (d) => d?.getValue("entityId") === entityId
        );

        if (existingIndex >= 0) {
          devices[existingIndex] = changedDevice;
        } else {
          devices.push(changedDevice);
        }

        root.setLinkedRecords(devices, "deviceStates");
      }
    },
  };

  console.log("[DeviceStateList] Setting up subscription...");
  useSubscription(subscriptionConfig);
  console.log("[DeviceStateList] Subscription configured");

  const devices = (data.deviceStates || []) as DeviceState[];

  // Sort by friendly name
  const sortedDevices = [...devices].sort((a, b) => {
    const nameA = (a.friendlyName || a.entityId).toLowerCase();
    const nameB = (b.friendlyName || b.entityId).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  if (devices.length === 0) {
    return (
      <div className="device-list">
        <h2>Device States</h2>
        <div className="empty-state">
          <p>No devices found. Ingest some events to see device states here.</p>
        </div>
      </div>
    );
  }

  const onDevices = sortedDevices.filter(
    (d) => d.currentState.toLowerCase() === "on"
  );
  const offDevices = sortedDevices.filter(
    (d) => d.currentState.toLowerCase() === "off"
  );

  return (
    <div className="device-list">
      <div className="device-list-header">
        <h2>Device States</h2>
        <div className="device-stats">
          <span className="stat stat-on">
            <span className="stat-dot stat-dot-on" />
            {onDevices.length} ON
          </span>
          <span className="stat stat-off">
            <span className="stat-dot stat-dot-off" />
            {offDevices.length} OFF
          </span>
        </div>
      </div>
      <div className="device-grid">
        {sortedDevices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
}

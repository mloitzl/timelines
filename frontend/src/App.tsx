import { RelayEnvironment } from "./relay/environment";
import { EventList } from "./components/EventList";
import { DeviceStateList } from "./components/DeviceStateList";
import { RelayEnvironmentProvider } from "react-relay";
import { Suspense } from "react";
import "./App.css";

export default function App() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <div className="App">
        <h1>Timelines</h1>
        <div className="app-grid">
          <Suspense
            fallback={<div className="loading">Loading devices...</div>}
          >
            <DeviceStateList />
          </Suspense>
          <Suspense fallback={<div className="loading">Loading events...</div>}>
            <EventList />
          </Suspense>
        </div>
      </div>
    </RelayEnvironmentProvider>
  );
}

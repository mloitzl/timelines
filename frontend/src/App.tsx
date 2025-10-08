import { RelayEnvironment } from "./relay/environment";
import { EventList } from "./components/EventList";
import { RelayEnvironmentProvider } from "react-relay";
import { Suspense } from "react";
import "./App.css";

export default function App() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <div className="App">
        <h1>Timelines</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <EventList />
        </Suspense>
      </div>
    </RelayEnvironmentProvider>
  );
}

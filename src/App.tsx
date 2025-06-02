import "./App.css";
import { useEffect } from "react";

import { UserPanel } from "./components/UserPanel";
import { web3Auth, initialize } from "./api/web3Auth";
import { ConnectionState } from "./types/ConnectionState";
import { useConnectionState } from "./hooks/useConnectionState";
import "./App.css";

let isInitialized: boolean = false;

export function App() {
  const { connectionState, setConnectionState } = useConnectionState();

  useEffect(() => {
    if (isInitialized) {
      return;
    }
    isInitialized = true;

    const init = async () => {
      await initialize();
      if (!web3Auth.connected) {
        setConnectionState(ConnectionState.Disconnected);
      }
    };

    init();
  });

  return <UserPanel connectionState={connectionState} />;
}

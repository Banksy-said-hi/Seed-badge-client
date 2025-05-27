import { useEffect, useState } from "react";
import { ADAPTER_EVENTS } from "@web3auth/base";

import { web3Auth } from "../api/web3Auth";
import { ConnectionState } from "../types/ConnectionState";

export function useConnectionState() {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Initializing,
  );

  useEffect(() => {
    web3Auth.on(ADAPTER_EVENTS.CONNECTED, () => {
      setConnectionState(ConnectionState.Connected);
    });
    web3Auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      setConnectionState(ConnectionState.Disconnected);
    });
  });

  return { connectionState, setConnectionState };
}

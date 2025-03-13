import { useEffect, useState } from "react";
import { ADAPTER_EVENTS } from "@web3auth/base";

import { web3auth } from "../web3auth";
import { ConnectionState } from "../types/ConnectionState";

export function useConnectionState() {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Initializing
  );

  useEffect(() => {
    web3auth.on(ADAPTER_EVENTS.CONNECTED, () => {
      setConnectionState(ConnectionState.Connected);
    });
    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      setConnectionState(ConnectionState.Disconnected);
    });
  });

  return { connectionState, setConnectionState };
}

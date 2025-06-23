import { useEffect } from "react";
import { web3Auth, initialize } from "./api/web3Auth";
import { ConnectionState } from "./types/ConnectionState";
import { useConnectionState } from "./hooks/useConnectionState";
import { Loading } from "./components/Loading";
import { Login } from "./components/Login";
import { Logout } from "./components/Logout";
import { EventRewardContainer } from "./containers/EventRewards";
import { TransferToken } from "./containers/TransferToken";
import { UserPanel } from "./containers/UserPanel";

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
  }, []);

  switch (connectionState) {
    case ConnectionState.Initializing:
      return <Loading />;
    case ConnectionState.Connected:
      return (
        <div>
          <UserPanel />
          <TransferToken />
          <EventRewardContainer />
          <Logout />
        </div>
      );
    default:
      return <Login />;
  }
}

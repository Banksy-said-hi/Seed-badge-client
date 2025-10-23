import { useEffect } from "react";
import { web3Auth, initialize } from "./api/web3Auth";
import { ConnectionState } from "./types/ConnectionState";
import { useConnectionState } from "./hooks/useConnectionState";
import { Loading } from "./components/Loading";
import { Login } from "./components/Login";
import { Logout } from "./components/Logout";

import { UserDetails } from "./components/UserDetails";
import BadgesList from "./components/BadgesList";

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
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Loading />
        </div>
      );
    case ConnectionState.Connected:
      return (
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8 flex justify-end items-center">
              <Logout />
            </div>
            
            {/* FusionAuth ID Section */}
            <div className="mb-6">
              <UserDetails />
            </div>
            
            {/* Badges Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <BadgesList />
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Login />
        </div>
      );
  }
}

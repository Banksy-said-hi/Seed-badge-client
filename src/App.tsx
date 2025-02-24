import './App.css'
import { useState, useEffect } from 'react';
import { web3AuthInstance, initialize } from './web3Auth';
import { WALLET_ADAPTERS } from '@web3auth/base';

// Because of React's strict mode App() is called twice, but the web3AuthInstance should be initialized only once.
// This variable is used to check if the web3AuthInstance is already initialized.
// You can also remove <StrictMode> tags from main.tsx but I feel like it's there for a reason.
// I hate javascript
let initialized : boolean = false;

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      
try{

if(initialized)
{
  return;
}

initialized = true;

web3AuthInstance.on("connected", () => {
  setIsConnected(web3AuthInstance.connected);
});

  await initialize();

  console.log("Web3Auth Initialized");

  setIsLoading(false);
}
catch (error){
  console.error("Web3Auth initialization error " + error);
}

      
    };
    init();
  }, []);

  web3AuthInstance.on("connected", () => {
    setIsConnected(web3AuthInstance.connected);
  });

  const connect = async () => {
    setIsLoading(true);
    try {
      const provider = await web3AuthInstance.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider: "google",
      });
      console.log("Connected " + provider);
      setIsConnected(true);
    } catch (error) {
      console.error("Connection Error " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await web3AuthInstance.logout();
      console.log("Logged out");
      setIsConnected(false);
    } catch (error) {
      console.error("Logout Error " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p>Check</p>
      {isConnected ? (
        <button onClick={logout} disabled={isLoading}>
          {isLoading ? "..." : "Logout"}
        </button>
      ) : (
        <button onClick={connect} disabled={isLoading}>
          {isLoading ? "..." : "Login with Google"}
        </button>
      )}
    </div>
  );
}

export default App;
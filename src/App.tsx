import './App.css'
import { useState, useEffect } from 'react';
import { web3AuthInstance } from './web3Auth';

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    web3AuthInstance.initModal()
      .then(() => {
        console.log("Web3Auth Initialized");
        setIsConnected(web3AuthInstance.connected);
      })
      .catch((error) => {
        console.error("Web3Auth initialization error " + error);
      });
  }, []);

  const connect = async () => {
    try {
      const provider = await web3AuthInstance.connect();
      console.log("Connected " + provider);
      setIsConnected(true);
    } catch (error) {
      console.error("Connection Error " + error);
    }
  };

  const logout = async () => {
    try {
      await web3AuthInstance.logout();
      console.log("Logged out");
      setIsConnected(false);
    } catch (error) {
      console.error("Logout Error " + error);
    }
  };

  return (
    <div>
      <p>Check</p>
      {isConnected ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </div>
  );
}

export default App;
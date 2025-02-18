import './App.css'
import { initWeb3Auth, connect } from './web3Auth';

function App() {
  initWeb3Auth().then(() => { console.log("Web3Auth Initialized") }).catch((error) => { console.error("Web3Auth initialization error " + error) });
  
  const handleButtonClick = async () => {
    try {
      const provider = await connect();
      console.log("Connected " + provider);
    } catch (error) {
      console.error("Connection Error " + error);
    }
  };

  return (
    <div>
      <p>Check</p>
      <button onClick={handleButtonClick}>Connect</button>
    </div>
  );
}

export default App

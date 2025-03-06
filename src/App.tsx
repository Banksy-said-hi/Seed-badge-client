import './App.css'
import { useState, useEffect } from 'react';
import { web3AuthInstance, initialize } from './web3Auth';
import { WALLET_ADAPTERS } from '@web3auth/base';
import crypto from 'crypto';
import { getConnectedAccount, getChain } from './web3AuthProvider';

let initialized: boolean = false;

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<string | null>(null);
  const [chain, setChainId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try
   {
        if (initialized) {
          return;
        }

        initialized = true;

        console.log("Initializing Web3Auth...");

        web3AuthInstance.on("connected", async () => {
          setIsConnected(web3AuthInstance.connected);
          setAccount(await getConnectedAccount());
          setChainId(await getChain());
        });

        await initialize();

        console.log("Web3Auth Initialized");

        if (!web3AuthInstance.connected)
        {
          await handleRedirect();
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Web3Auth initialization error " + error);
      }
    };
    init();
  }, []);

  const base64url = (str: Buffer) => {
    return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const generateCodeVerifier = () => {
    const codeVerifier = crypto.randomBytes(32).toString('hex');
    const codeChallenge = base64url(crypto.createHash('sha256').update(codeVerifier).digest());
    return { codeVerifier, codeChallenge };
  };

  const oAuthClientId = 'b17dec48-2a07-4c12-9cda-8778d9209707';

  const connect = async () => {
    setIsLoading(true);
    try {
      const { codeVerifier, codeChallenge } = generateCodeVerifier();
      const authUrl = `https://login.seed.game/oauth2/authorize?response_type=code&client_id=${oAuthClientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

      window.localStorage.setItem('code_verifier', codeVerifier);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Connection Error " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const codeVerifier = window.localStorage.getItem('code_verifier');

    if (code && codeVerifier) {
      try {
        const response = await fetch('https://login.seed.game/oauth2/token', {
          method: 'POST',
          // mode: 'no-cors', // Add this line to set the mode to 'no-cors'
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: oAuthClientId,
            code,
            redirect_uri: window.location.origin,
            code_verifier: codeVerifier,
          }),
        });

        const data = await response.json();
        console.log('Tokens:', data);

        const provider = await web3AuthInstance.connectTo(WALLET_ADAPTERS.AUTH, {
          loginProvider: "jwt",
          extraLoginOptions: {
            id_token: data.id_token,
            verifierIdField: "sub",
            domain: 'https://login.seed.game/oauth2',
            redirectUrl: window.location.origin,
          },
        });

        console.log("Connected " + provider);
        setIsConnected(true);
      } catch (error) {
        console.error("Token Exchange Error " + error);
      }
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await web3AuthInstance.logout();
      console.log("Logged out");
      setIsConnected(false);
      setAccount(null);
    } catch (error) {
      console.error("Logout Error " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {account ? (<p>{"Connected Account: " + account}</p>) : (<p>{isLoading ? "..." : "Not Connected"}</p>)}
      {chain ? (<p>{"Connected Network: " + chain}</p>) : (<p>{isLoading ? "..." : "Not Connected"}</p>)}
      {isConnected ? (
        <button onClick={logout} disabled={isLoading}>
          {isLoading ? "..." : "Logout"}
        </button>
      ) : (
        <button onClick={connect} disabled={isLoading}>
          {isLoading ? "..." : "Login with Klang"}
        </button>
      )}
    </div>
  );
}

export default App;
import './App.css'
import { useState, useEffect } from 'react';
import { web3AuthInstance, initialize } from './web3Auth';
import { WALLET_ADAPTERS } from '@web3auth/base';
import crypto from 'crypto';

let initialized: boolean = false;

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (initialized) {
          return;
        }

        initialized = true;

        web3AuthInstance.on("connected", () => {
          setIsConnected(web3AuthInstance.connected);
        });

        await initialize();

        console.log("Web3Auth Initialized");

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
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
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
            verifierIdField: "email",
          },
        });

        console.log("Connected " + provider);
        setIsConnected(true);
      } catch (error) {
        console.error("Token Exchange Error " + error);
      }
    }
  };

  useEffect(() => {
    handleRedirect();
  }, []);

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
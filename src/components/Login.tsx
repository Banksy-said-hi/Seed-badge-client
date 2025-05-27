import { useState, useEffect } from "react";
import { WALLET_ADAPTERS } from "@web3auth/base";

import { connect } from "../api/web3Auth";
import Loading from "./Loading";
import { authorize, authenticate } from "../api/klang";

async function login(setLoading: (loading: boolean) => void) {
  try {
    setLoading(true);
    await authorize();
  } catch (error) {
    setLoading(false);
    throw error;
  }
}

async function handleRedirect(setLoading: (loading: boolean) => void) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const codeVerifier = window.localStorage.getItem("code_verifier");

  // The state query parameter gets removed by web3Auth.init() so we save it in localStorage
  const state = urlParams.get("state") || window.localStorage.getItem("oauth_state");

  const storedState = window.localStorage.getItem("stored_oauth_state");

  if (code && codeVerifier && state === storedState) {
    try {
      setLoading(true);

      const token = await authenticate(code, codeVerifier);

      await connect(WALLET_ADAPTERS.AUTH, {
        loginProvider: "jwt",
        extraLoginOptions: {
          id_token: token,
          verifierIdField: "sub",
          redirectUrl: window.location.origin,
        },
      });
    } finally {
      setLoading(false);
    }
  }
}

function Login() {
  const [isInitialized, setInitialized] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const redirect = async () => {
      await handleRedirect(setLoading);
      setInitialized(true);
    };

    redirect();
  }, []);

  return (
    <div>
      {isInitialized ? (
        <button
          onClick={() => login(setLoading)}
          className={`px-4 py-2 font-semibold text-white bg-blue-500 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          Login with Klang
        </button>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Login;

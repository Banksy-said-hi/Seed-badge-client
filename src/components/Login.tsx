import { useState, useEffect } from "react";
import { WALLET_ADAPTERS } from "@web3auth/base";
import crypto from "crypto";

import { connect } from "../web3auth";
import { oAuthClientId } from "../authConfig";
import Loading from "./Loading";

async function login(setLoading: (loading: boolean) => void) {
  try {
    setLoading(true);
    const { codeVerifier, codeChallenge } = generateCodeVerifier();
    const authUrl = `https://login.seed.game/oauth2/authorize?response_type=code&client_id=${oAuthClientId}&redirect_uri=${encodeURIComponent(
      window.location.origin
    )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    window.localStorage.setItem("code_verifier", codeVerifier);
    window.location.href = authUrl;
  } catch (error) {
    setLoading(false);
    throw error;
  }
}

async function handleRedirect(setLoading: (loading: boolean) => void) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const codeVerifier = window.localStorage.getItem("code_verifier");

  if (code && codeVerifier) {
    try {
      setLoading(true);
      const response = await fetch("https://login.seed.game/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: oAuthClientId,
          code,
          redirect_uri: window.location.origin,
          code_verifier: codeVerifier,
        }),
      });

      const data = await response.json();

      await connect(WALLET_ADAPTERS.AUTH, {
        loginProvider: "jwt",
        extraLoginOptions: {
          id_token: data.id_token,
          verifierIdField: "sub",
          domain: "https://login.seed.game/oauth2",
          redirectUrl: window.location.origin,
        },
      });
    } finally {
      setLoading(false);
    }
  }
}

function generateCodeVerifier() {
  const codeVerifier = crypto.randomBytes(32).toString("hex");
  const codeChallenge = base64url(
    crypto.createHash("sha256").update(codeVerifier).digest()
  );
  return { codeVerifier, codeChallenge };
}

function base64url(str: Buffer) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
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
        <button onClick={() => login(setLoading)} disabled={isLoading}>
          Login with Klang
        </button>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Login;

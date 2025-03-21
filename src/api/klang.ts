import crypto from "crypto";

import { oAuthClientId } from "../configs/authConfig";
import { ReferralStatus } from "../types/ReferralStatus";

export async function authorize() {
  const { codeVerifier, codeChallenge } = generateCodeVerifier();

  const state = crypto.randomBytes(16).toString("hex");

  const authUrl = `https://login.seed.game/oauth2/authorize?client_id=${oAuthClientId}&redirect_uri=${encodeURIComponent(
    window.location.origin
  )}&response_type=code&scope=${encodeURIComponent(
    "openid profile email offline_access"
  )}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  window.localStorage.setItem("stored_oauth_state", state);
  window.localStorage.setItem("code_verifier", codeVerifier);
  window.location.href = authUrl;
}

export async function authenticate(code: string, codeVerifier: string) {
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

  return data.access_token;
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

export async function getReferralCode(): Promise<string> {
  // TODO replace with actual value from Klang API
  return "AXPYH";
}

export async function sendReferralCode(code: string): Promise<boolean> {
  if (code === "AAAAA") {
    return false;
  }
  // TODO replace with actual value from Klang API
  return true;
}

export async function getReferralStatus(): Promise<ReferralStatus> {
  // TODO replace with actual value from Klang API
  return ReferralStatus.None;
}

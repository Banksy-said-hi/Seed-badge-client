import crypto from "crypto";
import { SeedEvent } from "../types/SeedEvent";

import { oAuthClientId } from "../configs/authConfig";
import { SeedInvite } from "../types/SeedInvite";
import { SeedReward } from "../types/SeedReward";

// empty string for now since we're mocking the API calls
const BASE_API_URL = "";

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

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_API_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    // Add token if available
    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API request failed`);
  }

  return await response.json();
}

export async function getMyEvents(): Promise<SeedEvent[]> {
  return await apiFetch<SeedEvent[]>("/api/events", {
    method: "GET",
  });
}

export async function getInvites(): Promise<SeedInvite[]> {
  return await apiFetch<SeedInvite[]>("/api/invites", {
    method: "GET",
  });
}

export async function getRewards(): Promise<SeedReward[]> {
  return await apiFetch<SeedReward[]>("/api/rewards", {
    method: "GET",
  });
}

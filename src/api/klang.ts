import crypto from "crypto";

import type { SeedEvent, SeedReward, RewardClaimResult, SeedRewardClaim } from "../types/index";
import { oAuthClientId } from "../configs/authConfig";
import type { CachedData } from "../types/CachedData";

// empty string for now since we're mocking the API calls
const BASE_API_URL = "";

const DEFAULT_API_CACHE_TIMEOUT = 60 * 60 * 1000; // Default to 1 hour

export async function authorize() {
  const { codeVerifier, codeChallenge } = generateCodeVerifier();

  const state = crypto.randomBytes(16).toString("hex");

  const authUrl = `https://login.seed.game/oauth2/authorize?client_id=${oAuthClientId}&redirect_uri=${encodeURIComponent(
    window.location.origin,
  )}&response_type=code&scope=${encodeURIComponent(
    "openid profile email offline_access",
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
  const codeChallenge = base64url(crypto.createHash("sha256").update(codeVerifier).digest());
  return { codeVerifier, codeChallenge };
}

function base64url(str: Buffer) {
  return str.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  cacheResponse: boolean = false,
  cacheTimeout: number = DEFAULT_API_CACHE_TIMEOUT,
): Promise<T> {
  const data = await fetchFromCache<T>(endpoint);

  if (data) {
    return data;
  }

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

  const result: T = await response.json();

  if (cacheResponse) {
    cacheData<T>(endpoint, result, cacheTimeout);
  }

  return result;
}

function cacheData<T>(key: string, data: T, timeout: number) {
  const cachedData: CachedData = {
    timestamp: Date.now(),
    timeout: timeout,
    data: JSON.stringify(data),
  };

  window.localStorage.setItem(key, JSON.stringify(cachedData));
}

async function fetchFromCache<T>(key: string): Promise<T | null> {
  const data = window.localStorage.getItem(key);

  if (data) {
    try {
      const cachedData = JSON.parse(data) as CachedData;

      if (Date.now() - cachedData.timestamp < cachedData.timeout) {
        try {
          return JSON.parse(cachedData.data) as T;
        } catch (innerError) {
          console.error("Error parsing cached data content:", innerError);
          return null;
        }
      } else {
        // Cache expired, remove it
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error parsing cached data:", error);
      return null;
    }
  }

  return null;
}

export async function getEvents(): Promise<Map<string, SeedEvent[]>> {
  const data = await apiFetch<{ username: string; events: SeedEvent[] }[]>(
    "/api/events",
    {
      method: "GET",
    },
    true,
  );

  const map = new Map<string, SeedEvent[]>();

  data.forEach((item) => {
    map.set(item.username, item.events);
  });

  return map;
}

export async function getRewards(): Promise<SeedReward[]> {
  return await apiFetch<SeedReward[]>(
    "/api/rewards",
    {
      method: "GET",
    },
    true,
  );
}

export async function claimReward(rewardClaim: SeedRewardClaim): Promise<RewardClaimResult> {
  return await apiFetch<RewardClaimResult>(
    "/api/rewards/claim",
    {
      method: "POST",
      body: JSON.stringify(rewardClaim),
    },
    false,
  );
}

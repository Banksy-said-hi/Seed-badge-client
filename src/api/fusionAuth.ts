import { web3Auth } from "./web3Auth";
import { keccak256, toUtf8Bytes } from "ethers";

/**
 * Klang FusionAuth Integration
 * 
 * Architecture:
 * 1. User logs in via Klang's FusionAuth instance (https://login.seed.game)
 * 2. Web3Auth handles the OAuth callback and provides JWT tokens
 * 3. The OAuth access token from Web3Auth contains the Klang FusionAuth user data
 * 4. We can use this token to call Klang's userinfo endpoint to get the full user profile
 * 
 * The FusionAuth user ID is managed by Klang, not Web3Auth.
 * 
 * TOKEN TYPES EXPLAINED:
 * 
 * 1. idToken (Web3Auth's own ID token):
 *    - Issued by Web3Auth (iss: web3auth.io)
 *    - Contains Web3Auth's internal user identifier
 *    - Used for Web3Auth's own user session management
 *    - Subject (sub) is Web3Auth's internal user ID, NOT Klang's FusionAuth ID
 * 
 * 2. oAuthIdToken (Original OAuth ID token from Klang):
 *    - Issued by Klang's FusionAuth (iss: login.seed.game)
 *    - This is the ORIGINAL ID token that came from Klang's OAuth flow
 *    - Contains the actual Klang FusionAuth user information
 *    - Subject (sub) is the real Klang FusionAuth user ID
 *    - This is what we want for getting the true FusionAuth user ID
 * 
 * 3. oAuthAccessToken (OAuth access token from Klang):
 *    - Also issued by Klang's FusionAuth
 *    - Used to make API calls to Klang's services (like /oauth2/userinfo)
 *    - May also contain user identity information in JWT format
 */

/**
 * Retrieve the FusionAuth user ID from Klang's system with detailed verification
 * This first tries to get it from the userinfo endpoint, then falls back to token decoding
 */
export async function getFusionAuthUserId(): Promise<string | null> {
  try {
    console.log("🔍 Starting FusionAuth ID verification process...");

    // First, try to get it from the userinfo endpoint (most reliable - directly from Klang)
    const userDetails = await getFusionAuthUserDetails();
    if (userDetails?.sub) {
      console.log("✅ Retrieved FusionAuth user ID from Klang's userinfo endpoint:", userDetails.sub);
      console.log("📊 Full userinfo response from Klang:", userDetails);
      return userDetails.sub;
    }

    // Fallback: decode the OAuth access token (this should contain the Klang FusionAuth user ID)
    const userInfo = await web3Auth.getUserInfo();
    
    if (userInfo.oAuthAccessToken) {
      const decoded = decodeJWT(userInfo.oAuthAccessToken);
      console.log("🔐 Decoded OAuth Access Token:", decoded);
      
      if (decoded?.sub) {
        console.log("⚠️  Retrieved FusionAuth user ID from access token (fallback):", decoded.sub);
        console.log("🏷️  Token issuer (iss):", decoded.iss);
        console.log("👥  Token audience (aud):", decoded.aud);
        return decoded.sub;
      }
    }

    // Additional fallback: check the OAuth ID token
    if (userInfo.oAuthIdToken) {
      const decoded = decodeJWT(userInfo.oAuthIdToken);
      console.log("🆔 Decoded OAuth ID Token:", decoded);
      
      if (decoded?.sub) {
        console.log("⚠️  Retrieved FusionAuth user ID from OAuth ID token (fallback):", decoded.sub);
        console.log("🏷️  Token issuer (iss):", decoded.iss);
        console.log("👥  Token audience (aud):", decoded.aud);
        return decoded.sub;
      }
    }

    console.warn("❌ No Klang FusionAuth user ID found in tokens or userinfo endpoint");
    return null;
  } catch (error) {
    console.error("💥 Error retrieving Klang FusionAuth user ID:", error);
    return null;
  }
}

/**
 * Retrieve detailed FusionAuth user information using the access token
 * This makes a direct API call to Klang's FusionAuth instance to get full user details
 */
export async function getFusionAuthUserDetails(): Promise<any | null> {
  try {
    const userInfo = await web3Auth.getUserInfo();
    
    if (!userInfo.oAuthAccessToken) {
      console.warn("No OAuth access token available");
      return null;
    }

    // Use Klang's FusionAuth endpoint
    const fusionAuthUrl = "https://login.seed.game";
    
    const response = await fetch(`${fusionAuthUrl}/oauth2/userinfo`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userInfo.oAuthAccessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Klang FusionAuth API request failed: ${response.status} ${response.statusText}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error retrieving FusionAuth user details from Klang:", error);
    return null;
  }
}

/**
 * Simple JWT decoder (without signature verification)
 * For production use, consider using a proper JWT library with signature validation
 */
function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Explain the difference between idToken and oAuthIdToken
 * This helps understand which token contains the real Klang FusionAuth user ID
 */
export async function explainTokenDifferences(): Promise<{
  explanation: string;
  tokenAnalysis: any;
}> {
  const userInfo = await web3Auth.getUserInfo();
  const tokenAnalysis: any = {};

  // Analyze idToken (Web3Auth's token)
  if (userInfo.idToken) {
    const decoded = decodeJWT(userInfo.idToken);
    tokenAnalysis.idToken = {
      exists: true,
      issuer: decoded?.iss,
      subject: decoded?.sub,
      isFromKlang: decoded?.iss?.includes('seed.game') || decoded?.iss?.includes('klang'),
      purpose: "Web3Auth's internal user identification"
    };
  } else {
    tokenAnalysis.idToken = { exists: false };
  }

  // Analyze oAuthIdToken (Original Klang token)
  if (userInfo.oAuthIdToken) {
    const decoded = decodeJWT(userInfo.oAuthIdToken);
    tokenAnalysis.oAuthIdToken = {
      exists: true,
      issuer: decoded?.iss,
      subject: decoded?.sub,
      isFromKlang: decoded?.iss?.includes('seed.game') || decoded?.iss?.includes('klang'),
      purpose: "Original ID token from Klang's FusionAuth containing real user ID"
    };
  } else {
    tokenAnalysis.oAuthIdToken = { exists: false };
  }

  const explanation = `TOKEN DIFFERENCES EXPLAINED:

1. idToken:
   - This is Web3Auth's OWN ID token
   - Issued by Web3Auth (not Klang)
   - Contains Web3Auth's internal user identifier
   - The 'sub' (subject) claim is Web3Auth's user ID, NOT your Klang FusionAuth ID
   - Used for Web3Auth session management and wallet operations

2. oAuthIdToken:
   - This is the ORIGINAL ID token from Klang's FusionAuth
   - Issued by Klang's FusionAuth (login.seed.game)
   - Contains your actual Klang FusionAuth user information
   - The 'sub' (subject) claim is your REAL Klang FusionAuth user ID
   - This is what you want to use for Klang-specific operations

RECOMMENDATION:
For getting your Klang FusionAuth user ID, always prefer:
1. Direct API call to Klang's /oauth2/userinfo endpoint (most reliable)
2. oAuthIdToken's 'sub' claim (original Klang token)
3. Never use idToken's 'sub' claim (that's Web3Auth's internal ID)`;

  return {
    explanation,
    tokenAnalysis
  };
}

/**
 * Generate a Keccac256 hash of the FusionAuth ID with "klang" salt
 * This creates a deterministic hash suitable for smart contract arguments
 * 
 * @param fusionAuthId - The verified Klang FusionAuth user ID
 * @returns Keccac256 hash as hex string (0x prefixed)
 */
export function hashFusionAuthId(fusionAuthId: string): string {
  if (!fusionAuthId || typeof fusionAuthId !== 'string') {
    throw new Error('Invalid FusionAuth ID: must be a non-empty string');
  }

  // Normalize the input (trim whitespace, consistent casing)
  const normalizedId = fusionAuthId.trim();
  
  if (normalizedId.length === 0) {
    throw new Error('Invalid FusionAuth ID: cannot be empty after normalization');
  }

  // Add "klang" salt and create the input string
  const saltedInput = `klang:${normalizedId}`;
  
  // Generate Keccac256 hash
  const hash = keccak256(toUtf8Bytes(saltedInput));
  
  console.log(`🔐 Hashing FusionAuth ID for smart contract:`, {
    originalId: fusionAuthId,
    normalizedId,
    saltedInput,
    hash
  });

  return hash;
}

/**
 * Get the hashed FusionAuth ID ready for smart contract use
 * This combines verification and hashing in one call
 */
export async function getHashedFusionAuthId(): Promise<{
  userId: string | null;
  hashedId: string | null;
  source: string;
  confidence: string;
  error?: string;
}> {
  try {
    const verification = await verifyFusionAuthSource();
    
    if (!verification.userId) {
      return {
        userId: null,
        hashedId: null,
        source: verification.source,
        confidence: verification.confidence,
        error: 'No FusionAuth user ID available'
      };
    }

    const hashedId = hashFusionAuthId(verification.userId);

    return {
      userId: verification.userId,
      hashedId,
      source: verification.source,
      confidence: verification.confidence
    };
  } catch (error) {
    console.error('Error getting hashed FusionAuth ID:', error);
    return {
      userId: null,
      hashedId: null,
      source: 'unknown',
      confidence: 'low',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get FusionAuth user information from the ID token
 * This extracts user info from the ID token claims
 */
export async function getFusionAuthUserFromIdToken(): Promise<any> {
  try {
    const userInfo = await web3Auth.getUserInfo();
    
    if (!userInfo || !userInfo.idToken) {
      return null;
    }

    const decoded = decodeJWT(userInfo.idToken);
    return decoded;
  } catch (error) {
    console.error("Error getting FusionAuth user from ID token:", error);
    return null;
  }
}

/**
 * Get all available token claims for debugging with source verification
 * Returns decoded data from all available tokens with issuer analysis
 */
export async function getAllTokenClaims(): Promise<{
  accessToken?: any;
  idToken?: any;
  oAuthIdToken?: any;
  verification?: any;
}> {
  try {
    const userInfo = await web3Auth.getUserInfo();
    const result: any = {};
    const verification: any = {
      sources: [],
      issuers: [],
      audiences: [],
      tokenTypes: []
    };

    if (userInfo.oAuthAccessToken) {
      result.accessToken = decodeJWT(userInfo.oAuthAccessToken);
      verification.sources.push("OAuth Access Token (from Klang)");
      verification.issuers.push({
        token: "oAuthAccessToken",
        issuer: result.accessToken?.iss,
        isKlang: result.accessToken?.iss?.includes('seed.game') || result.accessToken?.iss?.includes('klang'),
        description: "Access token from Klang's FusionAuth - used for API calls"
      });
    }

    if (userInfo.idToken) {
      result.idToken = decodeJWT(userInfo.idToken);
      verification.sources.push("ID Token (from Web3Auth)");
      verification.issuers.push({
        token: "idToken",
        issuer: result.idToken?.iss,
        isKlang: result.idToken?.iss?.includes('seed.game') || result.idToken?.iss?.includes('klang'),
        description: "Web3Auth's own ID token - contains Web3Auth user ID, NOT Klang FusionAuth ID"
      });
    }

    if (userInfo.oAuthIdToken) {
      result.oAuthIdToken = decodeJWT(userInfo.oAuthIdToken);
      verification.sources.push("OAuth ID Token (original from Klang)");
      verification.issuers.push({
        token: "oAuthIdToken",
        issuer: result.oAuthIdToken?.iss,
        isKlang: result.oAuthIdToken?.iss?.includes('seed.game') || result.oAuthIdToken?.iss?.includes('klang'),
        description: "Original ID token from Klang's FusionAuth - contains real Klang FusionAuth user ID"
      });
    }

    result.verification = verification;

    console.log("🔍 Token Verification Report:");
    console.log("📋 Available token sources:", verification.sources);
    console.log("🏭 Token issuers:", verification.issuers);
    
    return result;
  } catch (error) {
    console.error("Error getting token claims:", error);
    return {};
  }
}

/**
 * Verify if the user ID is coming from Klang's FusionAuth vs Web3Auth
 * Returns detailed verification information
 */
export async function verifyFusionAuthSource(): Promise<{
  userId: string | null;
  source: 'klang-userinfo' | 'klang-token' | 'web3auth' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  evidence: any;
}> {
  try {
    const evidence: any = {};

    // Try to get from Klang's userinfo endpoint (highest confidence)
    try {
      const userDetails = await getFusionAuthUserDetails();
      if (userDetails?.sub) {
        evidence.userInfoResponse = userDetails;
        evidence.userInfoUrl = "https://login.seed.game/oauth2/userinfo";
        return {
          userId: userDetails.sub,
          source: 'klang-userinfo',
          confidence: 'high',
          evidence
        };
      }
    } catch (error) {
      evidence.userInfoError = error;
    }

    // Check token issuers
    const tokenClaims = await getAllTokenClaims();
    evidence.tokenClaims = tokenClaims;

    // Check if access token is from Klang
    if (tokenClaims.accessToken?.sub) {
      const issuer = tokenClaims.accessToken.iss;
      evidence.accessTokenIssuer = issuer;
      
      if (issuer?.includes('seed.game') || issuer?.includes('klang')) {
        return {
          userId: tokenClaims.accessToken.sub,
          source: 'klang-token',
          confidence: 'medium',
          evidence
        };
      }
    }

    // Check OAuth ID token
    if (tokenClaims.oAuthIdToken?.sub) {
      const issuer = tokenClaims.oAuthIdToken.iss;
      evidence.oAuthIdTokenIssuer = issuer;
      
      if (issuer?.includes('seed.game') || issuer?.includes('klang')) {
        return {
          userId: tokenClaims.oAuthIdToken.sub,
          source: 'klang-token',
          confidence: 'medium',
          evidence
        };
      }
    }

    // If we get here, it might be from Web3Auth
    if (tokenClaims.idToken?.sub) {
      evidence.idTokenIssuer = tokenClaims.idToken.iss;
      return {
        userId: tokenClaims.idToken.sub,
        source: 'web3auth',
        confidence: 'low',
        evidence
      };
    }

    return {
      userId: null,
      source: 'unknown',
      confidence: 'low',
      evidence
    };

  } catch (error) {
    console.error("Error verifying FusionAuth source:", error);
    return {
      userId: null,
      source: 'unknown',
      confidence: 'low',
      evidence: { error }
    };
  }
}
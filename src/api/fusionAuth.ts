import { web3Auth } from "./web3Auth";
import { keccak256, toUtf8Bytes } from "ethers";
import type {
  FusionAuthUserDetails,
  DecodedJWT,
  AllTokenClaims,
  TokenVerification,
  FusionAuthVerification,
  HashedFusionAuthId,
  TokenIssuerInfo,
} from "../types/FusionAuth";

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
    // First, try to get it from the userinfo endpoint (most reliable - directly from Klang)
    const userDetails = await getFusionAuthUserDetails();
    if (userDetails?.sub) {
      return userDetails.sub;
    }

    // Fallback: decode the OAuth access token (this should contain the Klang FusionAuth user ID)
    const userInfo = await web3Auth.getUserInfo();
    
    if (userInfo.oAuthAccessToken) {
      const decoded = decodeJWT(userInfo.oAuthAccessToken);
      
      if (decoded?.sub) {
        return decoded.sub;
      }
    }

    // Additional fallback: check the OAuth ID token
    if (userInfo.oAuthIdToken) {
      const decoded = decodeJWT(userInfo.oAuthIdToken);
      
      if (decoded?.sub) {
        return decoded.sub;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieve detailed FusionAuth user information using the access token
 * This makes a direct API call to Klang's FusionAuth instance to get full user details
 */
export async function getFusionAuthUserDetails(): Promise<FusionAuthUserDetails | null> {
  try {
    const userInfo = await web3Auth.getUserInfo();
    
    if (!userInfo.oAuthAccessToken) {
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
    return null;
  }
}

/**
 * Simple JWT decoder (without signature verification)
 * For production use, consider using a proper JWT library with signature validation
 */
function decodeJWT(token: string): DecodedJWT | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Generate a Keccac256 hash of the FusionAuth ID with "klang" salt
 * This creates a deterministic hash suitable for smart contract arguments
 * 
 * @param fusionAuthId - The verified Klang FusionAuth user ID
 * @returns Keccac256 hash as hex string (0x prefixed)
 */
function hashFusionAuthId(fusionAuthId: string): string {
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

  return hash;
}

/**
 * Get the hashed FusionAuth ID ready for smart contract use
 * This combines verification and hashing in one call
 */
export async function getHashedFusionAuthId(): Promise<HashedFusionAuthId> {
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
 * Get all available token claims for debugging with source verification
 * Returns decoded data from all available tokens with issuer analysis
 */
async function getAllTokenClaims(): Promise<AllTokenClaims> {
  try {
    const userInfo = await web3Auth.getUserInfo();
    const result: AllTokenClaims = {};
    const verification: TokenVerification = {
      sources: [],
      issuers: [],
      audiences: [],
      tokenTypes: []
    };

    if (userInfo.oAuthAccessToken) {
      const decoded = decodeJWT(userInfo.oAuthAccessToken);
      if (decoded) {
        result.accessToken = decoded;
        verification.sources.push("OAuth Access Token (from Klang)");
        const issuerInfo: TokenIssuerInfo = {
          token: "oAuthAccessToken",
          issuer: decoded.iss,
          isKlang: !!(decoded.iss?.includes('seed.game') || decoded.iss?.includes('klang')),
          description: "Access token from Klang's FusionAuth - used for API calls"
        };
        verification.issuers.push(issuerInfo);
      }
    }

    if (userInfo.idToken) {
      const decoded = decodeJWT(userInfo.idToken);
      if (decoded) {
        result.idToken = decoded;
        verification.sources.push("ID Token (from Web3Auth)");
        const issuerInfo: TokenIssuerInfo = {
          token: "idToken",
          issuer: decoded.iss,
          isKlang: !!(decoded.iss?.includes('seed.game') || decoded.iss?.includes('klang')),
          description: "Web3Auth's own ID token - contains Web3Auth user ID, NOT Klang FusionAuth ID"
        };
        verification.issuers.push(issuerInfo);
      }
    }

    if (userInfo.oAuthIdToken) {
      const decoded = decodeJWT(userInfo.oAuthIdToken);
      if (decoded) {
        result.oAuthIdToken = decoded;
        verification.sources.push("OAuth ID Token (original from Klang)");
        const issuerInfo: TokenIssuerInfo = {
          token: "oAuthIdToken",
          issuer: decoded.iss,
          isKlang: !!(decoded.iss?.includes('seed.game') || decoded.iss?.includes('klang')),
          description: "Original ID token from Klang's FusionAuth - contains real Klang FusionAuth user ID"
        };
        verification.issuers.push(issuerInfo);
      }
    }

    result.verification = verification;
    
    return result;
  } catch (error) {
    return {};
  }
}

/**
 * Verify if the user ID is coming from Klang's FusionAuth vs Web3Auth
 * Returns detailed verification information
 */
export async function verifyFusionAuthSource(): Promise<FusionAuthVerification> {
  try {
    const evidence: Record<string, unknown> = {};

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
    return {
      userId: null,
      source: 'unknown',
      confidence: 'low',
      evidence: { error }
    };
  }
}
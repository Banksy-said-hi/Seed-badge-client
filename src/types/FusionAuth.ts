export interface FusionAuthUserDetails {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: unknown;
}

export interface DecodedJWT {
  sub: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface TokenIssuerInfo {
  token: string;
  issuer?: string;
  isKlang: boolean;
  description: string;
}

export interface TokenVerification {
  sources: string[];
  issuers: TokenIssuerInfo[];
  audiences: string[];
  tokenTypes: string[];
}

export interface AllTokenClaims {
  accessToken?: DecodedJWT;
  idToken?: DecodedJWT;
  oAuthIdToken?: DecodedJWT;
  verification?: TokenVerification;
}

export type FusionAuthSource = 'klang-userinfo' | 'klang-token' | 'web3auth' | 'unknown';
export type FusionAuthConfidence = 'high' | 'medium' | 'low';

export interface FusionAuthVerification {
  userId: string | null;
  source: FusionAuthSource;
  confidence: FusionAuthConfidence;
  evidence: Record<string, unknown>;
}

export interface HashedFusionAuthId {
  userId: string | null;
  hashedId: string | null;
  source: FusionAuthSource;
  confidence: FusionAuthConfidence;
  error?: string;
}

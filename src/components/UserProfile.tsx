import { useState, useEffect } from "react";
import { Card } from "./Card";
import { ContentLoading } from "./ContentLoading";
import { verifyFusionAuthSource, getHashedFusionAuthId } from "../api/fusionAuth";
import type { FusionAuthVerification, HashedFusionAuthId } from "../types/FusionAuth";

export function UserProfile() {
  const [verificationResult, setVerificationResult] = useState<FusionAuthVerification | null>(null);
  const [hashedResult, setHashedResult] = useState<HashedFusionAuthId | null>(null);

  useEffect(() => {
    const fetchFusionAuthData = async () => {
      try {
        // Run comprehensive verification
        const verification = await verifyFusionAuthSource();
        setVerificationResult(verification);

        // Get hashed ID for smart contract use
        const hashed = await getHashedFusionAuthId();
        setHashedResult(hashed);
      } catch (fusionAuthError) {
        // Silent error handling
      }
    };

    fetchFusionAuthData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">User Profile</h1>

      {/* Klang FusionAuth ID - Top Priority with Verification */}
      <Card title="Klang FusionAuth ID">
        <ContentLoading isLoading={verificationResult === null}>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            {verificationResult?.userId ? (
              <div>
                {/* Main User ID Display */}
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-3">Your Klang FusionAuth User ID</p>
                  <p className="font-mono text-lg break-all text-blue-900 bg-white px-4 py-3 rounded-md border border-blue-300 shadow-sm">
                    {verificationResult.userId}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-yellow-800 font-medium">
                  🔍 Verifying your Klang FusionAuth ID...
                </p>
                <p className="text-yellow-600 text-sm mt-2">
                  Running verification checks to ensure we're getting the correct ID from Klang's system.
                </p>
              </div>
            )}
          </div>
        </ContentLoading>
      </Card>

      {/* Hashed FusionAuth ID for Smart Contracts */}
      <Card title="Smart Contract Hash">
        <ContentLoading isLoading={hashedResult === null}>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            {hashedResult?.hashedId ? (
              <div>
                {/* Main Hash Display */}
                <div className="text-center mb-4">
                  <p className="text-xs uppercase tracking-wide text-purple-600 font-semibold mb-3">
                    Keccac256 Hash (for Smart Contracts)
                  </p>
                  <p className="font-mono text-sm break-all text-purple-900 bg-white px-4 py-3 rounded-md border border-purple-300 shadow-sm">
                    {hashedResult.hashedId}
                  </p>
                </div>

                {/* Hash Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded border border-purple-200">
                    <p className="font-semibold text-purple-600 mb-1">Salt Used</p>
                    <p className="font-mono text-purple-800">klang</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-purple-200">
                    <p className="font-semibold text-purple-600 mb-1">Algorithm</p>
                    <p className="font-mono text-purple-800">Keccac256</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-purple-200">
                    <p className="font-semibold text-purple-600 mb-1">Format</p>
                    <p className="font-mono text-purple-800">0x + 64 hex chars</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-purple-200">
                    <p className="font-semibold text-purple-600 mb-1">Use Case</p>
                    <p className="font-mono text-purple-800">Smart Contract Argument</p>
                  </div>
                </div>

                {/* Copy Button */}
                <div className="text-center mt-4">
                  <button
                    onClick={() => hashedResult.hashedId && navigator.clipboard.writeText(hashedResult.hashedId)}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    📋 Copy Hash
                  </button>
                </div>
              </div>
            ) : hashedResult?.error ? (
              <div className="text-center">
                <p className="text-red-800 font-medium mb-2">
                  ❌ Cannot generate hash
                </p>
                <p className="text-red-600 text-sm">
                  {hashedResult.error}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-purple-800 font-medium">
                  🔐 Generating smart contract hash...
                </p>
                <p className="text-purple-600 text-sm mt-2">
                  Creating Keccac256 hash of your Klang FusionAuth ID with "klang" salt.
                </p>
              </div>
            )}
          </div>
        </ContentLoading>
      </Card>
    </div>
  );
}

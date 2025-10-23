import { useState, useEffect } from "react";
import { Card } from "./Card";
import { ContentLoading } from "./ContentLoading";
import { web3Auth } from "../api/web3Auth";
import { verifyFusionAuthSource } from "../api/fusionAuth";

export function UserDetails() {
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Fetch FusionAuth data with verification
        try {
          // Run comprehensive verification
          const verification = await verifyFusionAuthSource();
          setVerificationResult(verification);

          // Log verification results
          console.log("🔍 FusionAuth ID Verification Results:");
          console.log("👤 User ID:", verification.userId);
          console.log("🎯 Source:", verification.source);
          console.log("🔒 Confidence:", verification.confidence);
          console.log("📋 Evidence:", verification.evidence);
        } catch (fusionAuthError) {
          console.error("Error fetching FusionAuth data:", fusionAuthError);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (web3Auth.connected) {
      fetchUserInfo();
    }
  }, []);

  return (
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
              <p className="text-blue-800 font-medium">
                🔍 Verifying FusionAuth identity...
              </p>
              <p className="text-blue-600 text-sm mt-2">
                Checking authentication tokens and validating user identity.
              </p>
            </div>
          )}
        </div>
      </ContentLoading>
    </Card>
  );
}
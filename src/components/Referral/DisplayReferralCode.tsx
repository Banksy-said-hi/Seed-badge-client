import { useEffect, useState } from "react";

import { getReferralCode } from "../../api/klang";
import Loading from "../Loading";

function DisplayReferralCode() {
  const [referrralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const getCode = async () => {
      setReferralCode(await getReferralCode());
    };
    getCode();
  });

  return (
    <div>
      <p>Earn 20 PETAL for every Referral</p>
      {referrralCode ? (
        // TODO Copy and share button
        <p>Share Your Referral Code : {referrralCode}</p>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default DisplayReferralCode;

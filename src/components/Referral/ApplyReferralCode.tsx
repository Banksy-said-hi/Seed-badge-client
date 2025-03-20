import { useEffect, useState } from "react";

import Loading from "../Loading";
import ReferralCodeInput from "./ReferralCodeInput";
import { ReferralStatus } from "../../types/ReferralStatus";
import { getReferralStatus } from "../../api/klang";

function ApplyReferralCode() {
  const [referalStatus, setReferralStatus] = useState<ReferralStatus>(
    ReferralStatus.Loading
  );

  useEffect(() => {
    const getStatus = async () => {
      setReferralStatus(await getReferralStatus());
    };

    getStatus();
  }, []);

  switch (referalStatus) {
    case ReferralStatus.Loading:
      return <Loading />;

    case ReferralStatus.None:
      return <ReferralCodeInput setReferralStatus={setReferralStatus} />;

    case ReferralStatus.Completed:
      return <p>Referral Code Applied.</p>;
  }
}

export default ApplyReferralCode;

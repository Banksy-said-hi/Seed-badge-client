import DisplayReferralCode from "./DisplayReferralCode";
import ApplyReferralCode from "./ApplyReferralCode";
import Card from "../Card";

function ReferralPanel() {
  return (
    <Card
      title="Referral"
      content={
        <div>
          <DisplayReferralCode />
          <ApplyReferralCode />
        </div>
      }
    />
  );
}

export default ReferralPanel;

import Events from "./Events";
import Rewards from "./Rewards";
import { RewardsContainer } from "../../features/Rewards";

export function Landing() {
  return (
    <div>
      <RewardsContainer />
      <div className="flex">
        <div className="w-1/4">
          <Events />
        </div>
        <div className="w-1/2">
          <Rewards />
        </div>
      </div>
    </div>
  );
}

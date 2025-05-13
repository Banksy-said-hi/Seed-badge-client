import Events from "./Events";
import Rewards from "./Rewards";
import SelectReward from "./ComposeReward/SelectReward";

function Landing() {
  return (
    <div>
      <SelectReward />
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

export default Landing;

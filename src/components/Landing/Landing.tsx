import MyEvents from "./MyEvents";
import Invites from "./Invites";
import Rewards from "./Rewards";

function Landing() {
  return (
    <div className="flex">
      <div className="w-1/4">
        <MyEvents />
      </div>
      <div className="w-1/4">
        <Invites />
      </div>
      <div className="w-1/2">
        <Rewards />
      </div>
    </div>
  );
}

export default Landing;

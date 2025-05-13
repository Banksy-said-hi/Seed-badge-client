import { SeedReward } from "../../../types/SeedReward";
import { SeedEvent } from "../../../types/SeedEvent";
import Loading from "../../Loading";
import Card from "../../Card";
import AddEvents from "./AddEvents";
import RewardClaim from "./RewardClaim";
import { SeedRewardClaimDisplay } from "../../../types/SeedRewardClaimDisplay";

function ComposeRewardClaim({
  reward,
  rewardClaim,
  eventsMap,
  setRewardClaim,
  setEventsMap,
}: {
  reward: SeedReward;
  rewardClaim: SeedRewardClaimDisplay | null;
  eventsMap: Map<string, SeedEvent[]> | null;
  setRewardClaim: React.Dispatch<
    React.SetStateAction<SeedRewardClaimDisplay | null>
  >;
  setEventsMap: React.Dispatch<
    React.SetStateAction<Map<string, SeedEvent[]> | null>
  >;
}) {
  return (
    <Card
      title="Compose Reward"
      content={
        <>
          {eventsMap && rewardClaim ? (
            <div className="flex space-x-4">
              <RewardClaim
                reward={reward}
                eventsMap={eventsMap}
                rewardClaim={rewardClaim}
                setEventsMap={setEventsMap}
                setRewardClaim={setRewardClaim}
              />
              <AddEvents
                reward={reward}
                eventsMap={eventsMap}
                rewardClaim={rewardClaim}
                setEventsMap={setEventsMap}
                setRewardClaim={setRewardClaim}
              />
            </div>
          ) : (
            <Loading />
          )}
        </>
      }
    />
  );
}

export default ComposeRewardClaim;

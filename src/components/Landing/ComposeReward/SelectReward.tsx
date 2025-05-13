import { useEffect, useState } from "react";

import ComposeRewardClaim from "./ComposeRewardClaim";
import { getEvents } from "../../../api/klang";
import { getRewards } from "../../../api/klang";
import { SeedEvent } from "../../../types/SeedEvent";
import { SeedReward } from "../../../types/SeedReward";
import { SeedRewardClaimDisplay } from "../../../types/SeedRewardClaimDisplay";
import Card from "../../Card";

function SelectReward() {
  const [rewards, setRewards] = useState<SeedReward[] | null>(null);
  const [selectedReward, setSelectedReward] = useState<SeedReward | null>(null);
  const [rewardClaim, setRewardClaim] = useState<SeedRewardClaimDisplay | null>(
    null
  );
  const [eventsMap, setEventsMap] = useState<Map<string, SeedEvent[]> | null>(
    null
  );

  useEffect(() => {
    const fetchRewards = async () => {
      setRewards(await getRewards());
    };
    fetchRewards();
  }, []);

  const onRewardSelected = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Reset values when a new reward is selected

    const currentSelectedReward = rewards?.find(
      (reward) => reward.type === event.target.value
    );

    setSelectedReward(currentSelectedReward || null);

    if (!currentSelectedReward) return;

    setRewardClaim({
      eventsMap: new Map<string, SeedEvent[]>(),
    } as SeedRewardClaimDisplay);

    setEventsMap((await getEvents()) || new Map<string, SeedEvent[]>());
  };

  return (
    <Card
      title="Claim Reward"
      content={
        <div className="flex flex-col items-center">
          <select
            className="mt-2 w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
            onChange={(event) => onRewardSelected(event)}
          >
            <option value="" disabled>
              Select a reward
            </option>
            {rewards?.map((reward, index) => (
              <option key={index} value={reward.type}>
                {reward.type}
              </option>
            ))}
          </select>
          {selectedReward && (
            <ComposeRewardClaim
              reward={selectedReward}
              rewardClaim={rewardClaim}
              eventsMap={eventsMap}
              setRewardClaim={setRewardClaim}
              setEventsMap={setEventsMap}
            />
          )}
        </div>
      }
    />
  );
}

export default SelectReward;

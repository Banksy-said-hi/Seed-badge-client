import { Card } from "../../components/Card";
import { Loading } from "../../components/Loading";
import { Expandable } from "../../components/Expandable";
import { useEventRewards } from "../../context/EventRewardsContext";
import { RemoveEvent } from "./RemoveEvent";

export function RewardClaim() {
  const { selectedReward, rewardClaim, validate, handleClaim } = useEventRewards();

  if (!rewardClaim || !selectedReward) return <Loading />;

  return (
    <Card title="Reward Claim">
      {selectedReward.requiredEvents.map((requiredEvent, index) => {
        let count = 0;
        rewardClaim.eventsMap.forEach((events) => {
          count += events.filter((e) => e.data.type === requiredEvent.eventType).length;
        });

        return (
          <Expandable
            key={index}
            title={`${requiredEvent.eventType} (${count}/${requiredEvent.amount})`}
          >
            {Array.from(rewardClaim.eventsMap.entries()).map((entry) => {
              return entry[1].map((event, index) => (
                <RemoveEvent key={index} username={entry[0]} event={event} />
              ));
            })}
          </Expandable>
        );
      })}
      {validate() && <button onClick={handleClaim}>Claim</button>}
    </Card>
  );
}

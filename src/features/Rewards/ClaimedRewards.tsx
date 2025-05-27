import Card from "../../components/Card";
import Loading from "../../components/Loading";
import Expandable from "../../components/Expandable";
import { useRewards } from "../../context/RewardsContext";
import { RemoveEvent } from "./RemoveEvent";

export function ClaimedRewards() {
  const { selectedReward, rewardClaim, validate, handleClaim } = useRewards();

  if (!rewardClaim || !selectedReward) return <Loading />;

  return (
    <Card
      title="Reward Claim"
      content={
        <>
          {selectedReward.requiredEvents.map((requiredEvent, index) => {
            let count = 0;
            rewardClaim.eventsMap.forEach((events) => {
              count += events.filter((e) => e.data.type === requiredEvent.eventType).length;
            });

            return (
              <Expandable
                key={index}
                title={`${requiredEvent.eventType} (${count}/${requiredEvent.amount})`}
                content={
                  <>
                    {Array.from(rewardClaim.eventsMap.entries()).map((entry) => {
                      return entry[1].map((event, index) => (
                        <RemoveEvent key={index} username={entry[0]} event={event} />
                      ));
                    })}
                  </>
                }
              />
            );
          })}
          {validate() && <button onClick={handleClaim}>Claim</button>}
        </>
      }
    />
  );
}

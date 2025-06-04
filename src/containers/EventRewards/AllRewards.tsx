import { EventGroup } from "../../components/EventGroup";
import { Loading } from "../../components/Loading";
import { Card } from "../../components/Card";
import { Expandable } from "../../components/Expandable";
import { useEventRewards } from "../../context/EventRewardsContext";

export function AllRewards() {
  const { rewards } = useEventRewards();

  return (
    <div>
      {rewards ? (
        <Card title="All Rewards">
          {rewards.map((reward) => (
            <Expandable key={reward.type} title={reward.type}>
              <Card title="Required Events">
                {reward.requiredEvents.map((event) => {
                  return (
                    <EventGroup
                      key={event.eventType}
                      eventType={event.eventType}
                      eventCount={event.amount}
                    />
                  );
                })}
              </Card>
              <div>Payout : {reward.payout}</div>
              <div>Sponsored : {reward.sponsored ? "true" : "false"}</div>
              <Expandable title="Validators">
                {reward.validators.map((validator) => {
                  return <div key={validator}>{validator}</div>;
                })}
              </Expandable>
            </Expandable>
          ))}
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  );
}

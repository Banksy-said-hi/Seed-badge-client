import { useEffect, useState } from "react";

import { getRewards } from "../../api/klang";
import type { SeedReward } from "../../types/index";
import { EventGroup } from "./EventGroup";
import { Loading } from "../Loading";
import { Card } from "../Card";
import { Expandable } from "../Expandable";

export function Rewards() {
  const [rewards, setRewards] = useState<SeedReward[] | null>(null);

  useEffect(() => {
    const fetchRewards = async () => {
      const data = await getRewards();
      setRewards(data);
    };

    fetchRewards();
  }, []);

  return (
    <div>
      {rewards ? (
        <Card title="Rewards">
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

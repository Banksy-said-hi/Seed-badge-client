import { useEffect, useState } from "react";

import { getRewards } from "../../api/klang";
import { SeedReward } from "../../types/index";
import EventCompact from "./EventGroup";
import Loading from "../Loading";
import Card from "../Card";
import Expandable from "../Expandable";

function Rewards() {
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
        <Card
          title="Rewards"
          content={
            <>
              {rewards.map((reward) => (
                <Expandable
                  key={reward.type}
                  title={reward.type}
                  content={
                    <>
                      <Card
                        title="Required Events"
                        content={
                          <>
                            {reward.requiredEvents.map((event) => {
                              return (
                                <EventCompact
                                  key={event.eventType}
                                  eventType={event.eventType}
                                  eventCount={event.amount}
                                />
                              );
                            })}
                          </>
                        }
                      />
                      <div>Payout : {reward.payout}</div>
                      <div>
                        Sponsored : {reward.sponsored ? "true" : "false"}
                      </div>
                      <Expandable
                        title="Validators"
                        content={
                          <>
                            {reward.validators.map((validator) => {
                              return <div key={validator}>{validator}</div>;
                            })}
                          </>
                        }
                      />
                    </>
                  }
                />
              ))}
            </>
          }
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Rewards;

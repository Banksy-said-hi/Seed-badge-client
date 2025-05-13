import Card from "../../Card";
import Loading from "../../Loading";
import { SeedReward } from "../../../types/SeedReward";
import Expandable from "../../Expandable";
import RemoveEvent from "./RemoveEvent";
import { SeedEvent } from "../../../types/SeedEvent";
import { SeedRewardClaimDisplay } from "../../../types/SeedRewardClaimDisplay";
import { claimReward } from "../../../api/klang";
import { accountPair } from "../../../api/web3Auth";

function RewardClaim({
  reward,
  rewardClaim,
  eventsMap,
  setEventsMap,
  setRewardClaim,
}: {
  reward: SeedReward;
  rewardClaim: SeedRewardClaimDisplay | null;
  eventsMap: Map<string, SeedEvent[]>;
  setEventsMap: React.Dispatch<
    React.SetStateAction<Map<string, SeedEvent[]> | null>
  >;
  setRewardClaim: React.Dispatch<
    React.SetStateAction<SeedRewardClaimDisplay | null>
  >;
}) {
  const validate = (): boolean => {
    for (const requiredEvent of reward.requiredEvents) {
      let count = 0;

      Array.from(rewardClaim?.eventsMap.entries() || []).forEach(
        ([_, events]) => {
          count += events.filter((e) => {
            return e.data.type === requiredEvent.eventType;
          }).length;
        }
      );

      if (count !== requiredEvent.amount) {
        return false;
      }
    }

    return true;
  };

  const claim = async () => {
    const claimer = (await accountPair).smartAccount;
    const hash = await claimReward({
      type: reward.type,
      events: rewardClaim
        ? Array.from(rewardClaim.eventsMap.values()).flat()
        : [],
      claimer: claimer,
    });

    console.log("Reward claimed: ", hash);
  };

  return (
    <Card
      title="Reward Claim"
      content={
        <>
          {rewardClaim ? (
            <>
              {reward.requiredEvents.map((requiredEvent, index) => {
                let count = 0;
                rewardClaim.eventsMap.forEach((events) => {
                  count += events.filter((e) => {
                    return e.data.type === requiredEvent.eventType;
                  }).length;
                });

                return (
                  <Expandable
                    key={index}
                    title={`${requiredEvent.eventType} (${count}/${requiredEvent.amount})`}
                    content={
                      <>
                        {Array.from(rewardClaim.eventsMap.entries()).map(
                          (entry) => {
                            return entry[1].map((event, index) => {
                              return (
                                <RemoveEvent
                                  key={index}
                                  username={entry[0]}
                                  event={event}
                                  rewardClaim={rewardClaim}
                                  eventsMap={eventsMap}
                                  setEventsMap={setEventsMap}
                                  setRewardClaim={setRewardClaim}
                                />
                              );
                            });
                          }
                        )}
                      </>
                    }
                  />
                );
              })}
            </>
          ) : (
            <Loading />
          )}
          {validate() && <button onClick={() => claim()}>Claim</button>}
        </>
      }
    />
  );
}

export default RewardClaim;

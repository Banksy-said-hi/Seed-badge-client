import { SeedEvent } from "../../../types/SeedEvent";
import { SeedRewardClaimDisplay } from "../../../types/SeedRewardClaimDisplay";
import Expandable from "../../Expandable";
import Card from "../../Card";
import AddEvent from "./AddEvent";
import { SeedReward } from "../../../types/SeedReward";

function AddEvents({
  reward,
  eventsMap,
  rewardClaim,
  setEventsMap,
  setRewardClaim,
}: {
  reward: SeedReward;
  eventsMap: Map<string, SeedEvent[]>;
  rewardClaim: SeedRewardClaimDisplay;
  setEventsMap: React.Dispatch<
    React.SetStateAction<Map<string, SeedEvent[]> | null>
  >;
  setRewardClaim: React.Dispatch<
    React.SetStateAction<SeedRewardClaimDisplay | null>
  >;
}) {
  return (
    <Card
      title="Events"
      content={
        <>
          {reward.requiredEvents.map((event, index) => {
            const filteredEventsMap = Array.from(eventsMap.entries()).filter(
              ([_, events]) =>
                events.some((e) => e.data.type === event.eventType)
            );

            const count = filteredEventsMap.reduce(
              (c, [_, events]) =>
                c +
                events.filter((e) => e.data.type === event.eventType).length,
              0
            );

            return (
              <Expandable
                key={index}
                title={`${event.eventType} (${count})`}
                content={
                  <>
                    {filteredEventsMap.map(([username, events]) => {
                      return (
                        <Expandable
                          key={username}
                          title={username}
                          content={
                            <>
                              {events
                                .filter((e) => e.data.type == event.eventType)
                                .map((e, index) => {
                                  return (
                                    <AddEvent
                                      key={index}
                                      username={username}
                                      event={e}
                                      eventsMap={eventsMap}
                                      rewardClaim={rewardClaim}
                                      setEventsMap={setEventsMap}
                                      setRewardClaim={setRewardClaim}
                                    />
                                  );
                                })}
                            </>
                          }
                        />
                      );
                    })}
                  </>
                }
              />
            );
          })}
        </>
      }
    />
  );
}

export default AddEvents;

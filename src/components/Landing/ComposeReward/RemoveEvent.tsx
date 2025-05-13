import { SeedEvent } from "../../../types/SeedEvent";
import { SeedRewardClaimDisplay } from "../../../types/SeedRewardClaimDisplay";
import EventFull from "../EventFull";

function RemoveEvent({
  username,
  event,
  eventsMap,
  rewardClaim,
  setEventsMap,
  setRewardClaim,
}: {
  username: string;
  event: SeedEvent;
  eventsMap: Map<string, SeedEvent[]>;
  rewardClaim: SeedRewardClaimDisplay;
  setEventsMap: React.Dispatch<
    React.SetStateAction<Map<string, SeedEvent[]> | null>
  >;
  setRewardClaim: React.Dispatch<
    React.SetStateAction<SeedRewardClaimDisplay | null>
  >;
}) {
  const removeEvent = () => {
    const updatedMap = new Map(eventsMap);

    updatedMap.set(
      username,
      [...(updatedMap.get(username) || []), event]
    );

    setEventsMap(updatedMap);

    const updatedRewardClaim = {
      ...rewardClaim,
      eventsMap: new Map(rewardClaim.eventsMap),
    };

    updatedRewardClaim.eventsMap.set(
      username,
      updatedRewardClaim.eventsMap.get(username)?.filter((e) => {
        return e !== event;
      }) || []
    );

    setRewardClaim(updatedRewardClaim);
  };

  return (
    <>
      <EventFull event={event} />
      <button onClick={removeEvent}>-</button>
    </>
  );
}

export default RemoveEvent;

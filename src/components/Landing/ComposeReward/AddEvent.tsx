import { SeedEvent } from "../../../types/SeedEvent";
import EventFull from "../EventFull";
import { SeedRewardClaimDisplay } from "../../../types/SeedRewardClaimDisplay";

function AddEvent({
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
  const addEvent = () => {
    const updatedMap = new Map(eventsMap);

    updatedMap.set(
      username,
      (updatedMap.get(username) || []).filter((e) => e !== event)
    );

    setEventsMap(updatedMap);

    const updatedRewardClaim = {
      ...rewardClaim,
      eventsMap: new Map(rewardClaim.eventsMap),
    };

    if (!updatedRewardClaim.eventsMap.has(username)) {
      updatedRewardClaim.eventsMap.set(username, []);
    }

    updatedRewardClaim.eventsMap.get(username)?.push(event);

    setRewardClaim(updatedRewardClaim);
  };

  return (
    <>
      <EventFull event={event} />
      <button onClick={addEvent}>+</button>
    </>
  );
}

export default AddEvent;

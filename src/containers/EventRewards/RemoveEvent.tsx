import { useEventRewards } from "../../context/EventRewardsContext";
import type { SeedEvent } from "../../types/index";
import { EventFull } from "../../components/EventFull";

export function RemoveEvent({ username, event }: { username: string; event: SeedEvent }) {
  const { removeEvent } = useEventRewards();

  return (
    <>
      <EventFull event={event} />
      <button onClick={() => removeEvent(username, event)}>-</button>
    </>
  );
}

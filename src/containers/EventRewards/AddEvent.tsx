import { useEventRewards } from "../../context/EventRewardsContext";
import type { SeedEvent } from "../../types/index";
import { EventFull } from "../../components/EventFull";

export function AddEvent({ username, event }: { username: string; event: SeedEvent }) {
  const { addEvent } = useEventRewards();

  return (
    <>
      <EventFull event={event} />
      <button onClick={() => addEvent(username, event)}>+</button>
    </>
  );
}

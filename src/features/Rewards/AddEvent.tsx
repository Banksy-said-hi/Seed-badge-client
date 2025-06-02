import { useRewards } from "../../context/RewardsContext";
import type { SeedEvent } from "../../types/index";
import { EventFull } from "../../components/Landing/EventFull";

export function AddEvent({ username, event }: { username: string; event: SeedEvent }) {
  const { addEvent } = useRewards();

  return (
    <>
      <EventFull event={event} />
      <button onClick={() => addEvent(username, event)}>+</button>
    </>
  );
}

import { useRewards } from "../../context/RewardsContext";
import type { SeedEvent } from "../../types/index";
import EventFull from "../../components/Landing/EventFull";

export function RemoveEvent({ username, event }: { username: string; event: SeedEvent }) {
  const { removeEvent } = useRewards();

  return (
    <>
      <EventFull event={event} />
      <button onClick={() => removeEvent(username, event)}>-</button>
    </>
  );
}

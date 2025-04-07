import { SeedEvent } from "../../types/SeedEvent";
import Event from "./Event";

interface EventsProps {
  events: SeedEvent[];
}

function Events({ events }: EventsProps) {
  const counts = events.reduce((acc, event) => {
    acc.set(event.data.type, (acc.get(event.data.type) || 0) + 1);
    return acc;
  }, new Map<string, number>());

  return (
    <div>
      {Array.from(counts.entries()).map(([type, count]) => (
        <Event key={type} eventType={type} eventCount={count} />
      ))}
    </div>
  );
}

export default Events;

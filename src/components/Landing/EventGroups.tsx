import { SeedEvent } from "../../types/SeedEvent";
import EventGroup from "./EventGroup";

function EventGroups({ events }: { events: SeedEvent[] }) {
  const groups = events.reduce((group, event) => {
    const eventType = event.data.type;
    if (!group.has(eventType)) {
      group.set(eventType, []);
    }
    group.get(eventType)?.push(event);
    return group;
  }, new Map<string, SeedEvent[]>());

  return (
    <>
      {Array.from(groups.keys()).map((eventType) => {
        return (
          <EventGroup
            key={eventType}
            eventType={eventType}
            eventCount={groups.get(eventType)?.length || 0}
          />
        );
      })}
    </>
  );
}

export default EventGroups;

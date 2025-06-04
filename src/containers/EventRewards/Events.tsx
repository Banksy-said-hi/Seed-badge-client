import { Expandable } from "../../components/Expandable";
import { Card } from "../../components/Card";
import { useEventRewards } from "../../context/EventRewardsContext";
import { AddEvent } from "./AddEvent";

export function Events() {
  const { selectedReward, eventsMap, rewardClaim } = useEventRewards();

  if (!selectedReward || !eventsMap || !rewardClaim) return null;

  return (
    <Card title="Events">
      {selectedReward.requiredEvents.map((event, index) => {
        const filteredEventsMap = Array.from(eventsMap.entries()).filter(([_, events]) =>
          events.some((e) => e.data.type === event.eventType),
        );

        const count = filteredEventsMap.reduce(
          (c, [_, events]) => c + events.filter((e) => e.data.type === event.eventType).length,
          0,
        );

        return (
          <Expandable key={index} title={`${event.eventType} (${count})`}>
            {filteredEventsMap.map(([username, events]) => (
              <Expandable key={username} title={username}>
                {events
                  .filter((e) => e.data.type === event.eventType)
                  .map((e, index) => (
                    <AddEvent key={index} username={username} event={e} />
                  ))}
              </Expandable>
            ))}
          </Expandable>
        );
      })}
    </Card>
  );
}

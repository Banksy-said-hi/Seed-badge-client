import { Card } from "../../components/Card";
import { Loading } from "../../components/Loading";
import { EventGroups } from "../../components/EventGroups";
import { Expandable } from "../../components/Expandable";
import { useEventRewards } from "../../context/EventRewardsContext";

export function AllEvents() {
  const { eventsMap } = useEventRewards();

  return (
    <div>
      {eventsMap ? (
        <Card title="All Events">
          {Array.from(eventsMap.keys()).map((username) => {
            return (
              <Expandable key={username} title={username}>
                <EventGroups events={eventsMap.get(username) || []} />
              </Expandable>
            );
          })}
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  );
}

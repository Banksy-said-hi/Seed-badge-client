import { useEffect, useState } from "react";

import { getEvents } from "../../api/klang";
import type { SeedEvent } from "../../types/index";
import { Card } from "../Card";
import { Loading } from "../Loading";
import { EventGroups } from "./EventGroups";
import { Expandable } from "../Expandable";

export function Events() {
  const [eventsMap, setEventsMap] = useState<Map<string, SeedEvent[]> | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      setEventsMap(data);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {eventsMap ? (
        <Card title="Events">
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

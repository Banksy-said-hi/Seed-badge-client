import { useEffect, useState } from "react";

import { getEvents } from "../../api/klang";
import { SeedEvent } from "../../types/SeedEvent";
import Card from "../Card";
import Loading from "../Loading";
import EventGroups from "./EventGroups";
import Expandable from "../Expandable";

function Events() {
  const [eventsMap, setEventsMap] = useState<Map<string, SeedEvent[]> | null>(
    null
  );

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
        <Card
          title="Events"
          content={
            <>
              {Array.from(eventsMap.keys()).map((username) => {
                return (
                  <Expandable
                    key={username}
                    title={username}
                    content={
                      <EventGroups events={eventsMap.get(username) || []} />
                    }
                  />
                );
              })}
            </>
          }
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Events;

import { getMyEvents } from "../../api/klang";
import { useState, useEffect } from "react";
import { SeedEvent } from "../../types/SeedEvent";
import Loading from "../Loading";
import Events from "./Events";
import Card from "../Card";

function MyEvents() {
  const [events, setEvents] = useState<SeedEvent[] | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setEvents(await getMyEvents());
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {events ? (
        <Card title="My Events" content={<Events events={events} />} />
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default MyEvents;

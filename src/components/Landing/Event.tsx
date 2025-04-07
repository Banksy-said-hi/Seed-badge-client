interface EventProps {
  eventType: string;
  eventCount: number;
}

function Event({ eventType, eventCount }: EventProps) {
  return (
    <div>
      <h3>{eventType}</h3>
      <p>Event Count: {eventCount}</p>
    </div>
  );
}

export default Event;

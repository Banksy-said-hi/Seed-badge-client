interface EventProps {
  eventType: string;
  eventCount: number;
}

function EventGroup({ eventType, eventCount }: EventProps) {
  return (
    <div>
      <p>
        {eventType} ({eventCount})
      </p>
    </div>
  );
}

export default EventGroup;

type EventProps = {
  eventType: string;
  eventCount: number;
};

export function EventGroup({ eventType, eventCount }: EventProps) {
  return (
    <div>
      <p>
        {eventType} ({eventCount})
      </p>
    </div>
  );
}

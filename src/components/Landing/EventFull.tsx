import type { SeedEvent } from "../../types/index";
import Expandable from "../Expandable";

function EventFull({ event }: { event: SeedEvent }) {
  return (
    <Expandable
      title={event.data.type}
      content={
        <div>
          <p>
            <b>UserId :</b> {event.data.userId}
          </p>
          <p>
            <b>Timestamp :</b> {event.data.timestamp}
          </p>
          <p>
            <b>Hash :</b> {event.hash}
          </p>
          {Object.entries(event.data)
            .filter(([key]) => !["type", "userId", "timestamp"].includes(key))
            .map(([key, value]) => (
              <p key={key}>
                <b>{key} :</b> {value?.toString()}
              </p>
            ))}
        </div>
      }
    />
  );
}

export default EventFull;

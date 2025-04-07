import { SeedEvent } from "../../types/SeedEvent";
import Events from "./Events";
import Card from "../Card";

interface InviteProps {
  username: string;
  events: SeedEvent[];
}

function Invite({ username, events }: InviteProps) {
  return <Card title={username} content={<Events events={events} />} />;
}

export default Invite;

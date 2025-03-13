import Login from "./Login";
import Logout from "./Logout";
import Address from "./Address";
import Network from "./Network";
import { ConnectionState } from "../types/ConnectionState";
import Loading from "./Loading";

interface UserPanelProps {
  connectionState: ConnectionState;
}

function UserPanel({ connectionState }: UserPanelProps) {
  let content;

  switch (connectionState) {
    case ConnectionState.Initializing:
      content = <Loading />;
      break;
    case ConnectionState.Connected:
      content = (
        <div>
          <Address />
          <Network />
          <Logout />
        </div>
      );
      break;
    case ConnectionState.Disconnected:
      content = <Login />;
      break;
  }

  return <div>{content}</div>;
}

export default UserPanel;

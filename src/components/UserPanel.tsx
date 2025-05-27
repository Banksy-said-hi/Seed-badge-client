import Login from "./Login";
import Logout from "./Logout";
import Address from "./Address";
import Network from "./Network";
import { ConnectionState } from "../types/ConnectionState";
import Loading from "./Loading";
import Balance from "./Balance";
import TransferToken from "./TransferToken";
import Card from "./Card";
import { Landing } from "./Landing/Landing";

type UserPanelProps = {
  connectionState: ConnectionState;
};

function UserPanel({ connectionState }: UserPanelProps) {
  let content;

  switch (connectionState) {
    case ConnectionState.Initializing:
      content = <Loading />;
      break;
    case ConnectionState.Connected:
      content = (
        <div>
          <Card
            title="User Panel"
            content={
              <div>
                <Address />
                <Network />
                <Balance />
              </div>
            }
          />
          <TransferToken />
          <Landing />
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

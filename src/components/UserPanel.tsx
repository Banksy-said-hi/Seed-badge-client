import { Login } from "./Login";
import { Logout } from "./Logout";
import { Account } from "./Account";
import { Network } from "./Network";
import { ConnectionState } from "../types/ConnectionState";
import { Loading } from "./Loading";
import { Balance } from "./Balance";
import { TransferToken } from "./TransferToken";
import { Card } from "./Card";
import { Landing } from "./Landing/Landing";

type UserPanelProps = {
  connectionState: ConnectionState;
};

export function UserPanel({ connectionState }: UserPanelProps) {
  switch (connectionState) {
    case ConnectionState.Initializing:
      return <Loading />;
    case ConnectionState.Connected:
      return (
        <div>
          <Card title="User Panel">
            <div>
              <Account />
              <Network />
              <Balance />
            </div>
          </Card>
          <TransferToken />
          <Landing />
          <Logout />
        </div>
      );
    default:
      return <Login />;
  }
}

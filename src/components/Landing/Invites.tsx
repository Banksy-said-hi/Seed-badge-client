import { useState, useEffect } from "react";

import { getInvites } from "../../api/klang";
import { SeedInvite } from "../../types/SeedInvite";
import Invite from "./Invite";
import Loading from "../Loading";
import Card from "../Card";

function Invites() {
  const [invites, setInvites] = useState<SeedInvite[] | null>(null);

  useEffect(() => {
    const fetchInvites = async () => {
      const data = await getInvites();
      setInvites(data);
    };

    fetchInvites();
  }, []);

  return (
    <div>
      {invites ? (
        <Card
          title="Invites"
          content={
            <>
              {invites.map((invite) => (
                <Invite
                  key={invite.username}
                  username={invite.username}
                  events={invite.events}
                />
              ))}
            </>
          }
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Invites;

import { useState, useEffect } from "react";
import { verifierId } from "../../api/web3Auth";
import Loading from "../Loading";

function Username({ userId }: { userId: string }) {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const id = await verifierId;
      if (id === userId) {
        setUsername("You");
      } else {
        // Fetch username
      }
    };
    fetchUsername();
  }, []);

  return <p>{username ? username : <Loading />}</p>;
}

export default Username;

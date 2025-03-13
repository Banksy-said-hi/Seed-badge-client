import { useState, useEffect } from "react";

import { getChain } from "../web3auth";
import Loading from "./Loading";

function Network() {
  const [chain, setChain] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setChain(await getChain());
    };
    init();
  }, []);

  return <div>{chain ? <p>Connected Network: {chain}</p> : <Loading />}</div>;
}

export default Network;

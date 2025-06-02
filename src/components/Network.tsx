import { useState, useEffect } from "react";

import { getChain } from "../api/web3Auth";
import { Loading } from "./Loading";

export function Network() {
  const [chain, setChain] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setChain(await getChain());
    };
    init();
  }, []);

  return <div>{chain ? <p>Connected Network: {chain}</p> : <Loading />}</div>;
}

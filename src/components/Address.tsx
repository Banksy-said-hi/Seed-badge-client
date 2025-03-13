import { useState, useEffect } from "react";

import { getConnectedAccount } from "../web3auth";
import Loading from "./Loading";

function Account() {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setAccount(await getConnectedAccount());
    };
    init();
  }, []);

  return (
    <div>{account ? <p>Connected Account: {account}</p> : <Loading />}</div>
  );
}

export default Account;

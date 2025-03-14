import { useState, useEffect } from "react";

import { getConnectedAccountPair } from "../web3Auth";
import Loading from "./Loading";
import { AccountPair } from "../types/AccountPair";

function Account() {
  const [account, setAccount] = useState<AccountPair | null>(null);

  useEffect(() => {
    const init = async () => {
      setAccount(await getConnectedAccountPair());
    };
    init();
  }, []);

  return (
    <div>
      {account ? (
        <div>
          <p>Smart Account: {account.smartAccount}</p>
          <p>External Account: {account.externalAccount}</p>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Account;

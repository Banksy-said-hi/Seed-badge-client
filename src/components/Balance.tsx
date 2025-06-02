import { useEffect, useState } from "react";

import { Loading } from "./Loading";
import { getTokenBalanceWithSymbol, accountPair } from "../api/web3Auth";
import { tokenContract } from "../contracts/tokenContract";

export function Balance() {
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  useEffect(() => {
    const getTokenBalance = async () => {
      setTokenBalance(await getTokenBalanceWithSymbol());
    };

    getTokenBalance();

    const callback = async (from: string, to: string, _amount: bigint) => {
      const account = (await accountPair).smartAccount;

      if (from === account || to === account) {
        getTokenBalance();
      }
    };

    tokenContract.onTransfer(callback);
  }, []);

  return <div>{tokenBalance ? <p>Token Balance : {tokenBalance}</p> : <Loading />}</div>;
}

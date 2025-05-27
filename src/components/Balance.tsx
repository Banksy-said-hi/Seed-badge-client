import { useEffect, useState } from "react";

import Loading from "./Loading";
import { getTokenBalanceWithSymbol } from "../api/web3Auth";
import { tokenContract } from "../contracts/tokenContract";

function Balance() {
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  useEffect(() => {
    const getTokenBalance = async () => {
      setTokenBalance(await getTokenBalanceWithSymbol());
    };

    getTokenBalance();

    tokenContract.onTransfer(async () => {
      await getTokenBalance();
    });
  });

  return <div>{tokenBalance ? <p>Token Balance : {tokenBalance}</p> : <Loading />}</div>;
}

export default Balance;

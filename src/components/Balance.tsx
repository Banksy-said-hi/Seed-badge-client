import { useEffect, useState } from "react";

import Loading from "./Loading";
import { getTokenBalanceWithSymbol } from "../api/web3Auth";

function Balance() {
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  useEffect(() => {
    const getBalance = async () => {
      setTokenBalance(await getTokenBalanceWithSymbol());
    };

    getBalance();
  });

  return (
    <div>
      {tokenBalance ? <p>Token Balance : {tokenBalance}</p> : <Loading />}
    </div>
  );
}

export default Balance;

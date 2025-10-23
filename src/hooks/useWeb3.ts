import { useState, useEffect } from "react";
import { accountPair, getChain } from "../api/web3Auth";
import type { AccountPair } from "../types";

export function useWeb3() {
  const [account, setAccount] = useState<AccountPair | null>(null);
  const [chain, setChain] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setAccount(await accountPair);
      setChain(await getChain());
    };
    init();
  }, []);

  return {
    account,
    chain,
  };
}

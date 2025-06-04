import { useState, useEffect } from "react";
import { accountPair, getChain, getTokenBalanceWithSymbol } from "../api/web3Auth";
import { tokenContract } from "../contracts/tokenContract";
import type { AccountPair } from "../types";

export function useWeb3() {
  const [account, setAccount] = useState<AccountPair | null>(null);
  const [chain, setChain] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setAccount(await accountPair);
      setChain(await getChain());
    };
    init();
  }, []);

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

  return {
    account,
    chain,
    tokenBalance,
  };
}

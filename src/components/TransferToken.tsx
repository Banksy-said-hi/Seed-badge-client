import { useEffect, useState } from "react";

import { Card } from "./Card";
import { token, transferTokens, formatUnitsToBaseUnit } from "../api/web3Auth";

export function TransferToken() {
  const [symbol, setSymbol] = useState<string | null>(null);
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    const getTokenSymbol = async () => {
      setSymbol((await token).symbol);
    };

    getTokenSymbol();
  }, []);

  const transfer = async () => {
    const amountInBaseUnit = await formatUnitsToBaseUnit(Number(amount));

    const response = await transferTokens(toAddress, amountInBaseUnit);

    console.log(response);
  };

  // TODO: max amount button
  return (
    <Card title="Transfer Token">
      <div className="flex flex-col items-center space-y-4">
        <input
          className="p-2 border rounded w-full"
          placeholder="Address"
          value={toAddress}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToAddress(e.target.value)}
        ></input>
        <div className="flex w-full items-center space-x-2">
          <input
            className="p-2 border rounded w-full"
            placeholder="Amount"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
          ></input>
          <p>{symbol}</p>
        </div>
        <button onClick={transfer} className="p-2 bg-blue-500 text-white rounded">
          Transfer
        </button>
      </div>
    </Card>
  );
}

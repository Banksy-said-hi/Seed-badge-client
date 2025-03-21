import { tokenAddress, abiInterface } from "../configs/chainConfig";
import { accountPair, request } from "./web3Auth";

async function call<R>(
  methodName: string,
  functionName: string,
  functionParams?: ReadonlyArray<any>
): Promise<R> {
  const data = abiInterface.encodeFunctionData(functionName, functionParams);

  const account = (await accountPair).smartAccount;

  let params;

  switch (methodName) {
    case "eth_call":
      params = [
        {
          to: tokenAddress,
          data: data,
        },
      ];
      break;
    case "eth_sendTransaction":
      params = [
        {
          from: account,
          to: tokenAddress,
          value: "0x0",
          data: data,
        },
      ];
      break;
  }

  const response = await request<typeof params, string>({
    method: methodName,
    params: params,
  });

  if (methodName === "eth_sendTransaction") {
    return response as R;
  }

  const result = abiInterface.decodeFunctionResult(functionName, response);

  return result as R;
}

export async function read<R>(
  functionName: string,
  functionParams?: ReadonlyArray<any>
): Promise<R> {
  return call<R>("eth_call", functionName, functionParams);
}

export async function send(
  functionName: string,
  functionParams?: ReadonlyArray<any>
): Promise<string> {
  return call<string>("eth_sendTransaction", functionName, functionParams);
}

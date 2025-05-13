import { ethers } from "ethers";
import { accountPair, request } from "../api/web3Auth";

export class Contract {
  address: string;
  abiInterface: ethers.Interface;

  constructor(address: string, abiInterface: ethers.Interface) {
    this.address = address;
    this.abiInterface = abiInterface;
  }

  async call<R>(
    methodName: string,
    functionName: string,
    functionParams?: ReadonlyArray<any>
  ): Promise<R> {
    const data = this.abiInterface.encodeFunctionData(
      functionName,
      functionParams
    );

    const account = (await accountPair).smartAccount;

    let params;

    switch (methodName) {
      case "eth_call":
        params = [
          {
            to: this.address,
            data: data,
          },
        ];
        break;
      case "eth_sendTransaction":
        params = [
          {
            from: account,
            to: this.address,
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

    const result = this.abiInterface.decodeFunctionResult(
      functionName,
      response
    );

    return result as R;
  }

  async read<R>(
    functionName: string,
    functionParams?: ReadonlyArray<any>
  ): Promise<R> {
    return this.call<R>("eth_call", functionName, functionParams);
  }

  async send(
    functionName: string,
    functionParams?: ReadonlyArray<any>
  ): Promise<string> {
    return this.call<string>(
      "eth_sendTransaction",
      functionName,
      functionParams
    );
  }
}

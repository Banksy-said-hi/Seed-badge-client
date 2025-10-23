import { ethers } from "ethers";

import { accountPair, request } from "../api/web3Auth";
import { chainConfig } from "../configs/chainConfig";

export class Contract {
  address: string;
  abiInterface: ethers.Interface;
  ethersContract: ethers.Contract;

  constructor(address: string, abiInterface: ethers.Interface) {
    this.address = address;
    this.abiInterface = abiInterface;
    console.log('🔧 Contract: Creating provider with wsTarget:', chainConfig.wsTarget);
    console.log('🔧 Contract: Chain ID:', chainConfig.chainId, 'Display:', chainConfig.displayName);
    const provider = new ethers.WebSocketProvider(chainConfig.wsTarget);
    this.ethersContract = new ethers.Contract(address, abiInterface, provider);
  }

  async call<R>(
    methodName: string,
    functionName: string,
    functionParams?: ReadonlyArray<unknown>,
  ): Promise<R> {
    const data = this.abiInterface.encodeFunctionData(functionName, functionParams);

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

    const result = this.abiInterface.decodeFunctionResult(functionName, response);

    return result as R;
  }

  async read<R>(functionName: string, functionParams?: ReadonlyArray<unknown>): Promise<R> {
    return this.call<R>("eth_call", functionName, functionParams);
  }

  async send(functionName: string, functionParams?: ReadonlyArray<unknown>): Promise<string> {
    return this.call<string>("eth_sendTransaction", functionName, functionParams);
  }

  addListener(eventName: string, listener: ethers.Listener): void {
    this.ethersContract.on(eventName, listener);
  }

  removeListener(eventName: string, listener: ethers.Listener): void {
    this.ethersContract.off(eventName, listener);
  }
}

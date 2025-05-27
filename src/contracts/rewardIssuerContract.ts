import { ethers } from "ethers";
import { Contract } from "./contract";

class RewardIssuerContract extends Contract {
  constructor(address: string, abiInterface: ethers.Interface) {
    super(address, abiInterface);
  }

  async verifyAndTransfer(message: string): Promise<string> {
    return await this.send("verifyAndTransfer", [message]);
  }
}

// Define the contract address and ABI
const contractAddress = "0x6e9129eFf601e0B5C6cB463e46520DD3BbF924f7";
const contractABI = [
  // Minimal ABI for the verifyAndTransfer function
  {
    inputs: [
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "verifyAndTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const rewardIssuerContract = new RewardIssuerContract(
  contractAddress,
  new ethers.Interface(contractABI),
);

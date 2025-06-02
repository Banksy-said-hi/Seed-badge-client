import { ethers } from "ethers";
import { Contract } from "./contract";

const tokenAddress: `0x${string}` = "0x44b36fd983F3906af2275b9e72495AddC83C6595";

const erc20Abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

class TokenContract extends Contract {
  async onTransfer(callback: (from: string, to: string, amount: bigint) => void) {
    this.addListener("Transfer", callback);
  }

  async offTransfer(callback: (from: string, to: string, amount: bigint) => void) {
    this.removeListener("Transfer", callback);
  }
}

const erc20AbiInterface = new ethers.Interface(erc20Abi);

export const tokenContract = new TokenContract(tokenAddress, erc20AbiInterface);

import { ethers } from "ethers";
import { Contract } from "./contract";
import { accountPair } from "../api/web3Auth";
import { chainConfig } from "../configs/chainConfig";

const tokenAddress: `0x${string}` = "0x3C1adF0A04792CF870DdA5F01a6EABE503e82B12";

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
  ethersContract: ethers.Contract;

  constructor(address: string, abiInterface: ethers.Interface) {
    super(address, abiInterface);
    const provider = new ethers.WebSocketProvider(chainConfig.wsTarget);
    this.ethersContract = new ethers.Contract(address, abiInterface, provider);
  }

  async onTransfer(callback: (from: string, to: string, amount: bigint) => void) {
    const account = (await accountPair).smartAccount;

    this.ethersContract.on("Transfer", (from, to, amount) => {
      if (from === account || to === account) {
        callback(from, to, BigInt(amount));
      }
    });
  }
}

const erc20AbiInterface = new ethers.Interface(erc20Abi);

export const tokenContract = new TokenContract(tokenAddress, erc20AbiInterface);

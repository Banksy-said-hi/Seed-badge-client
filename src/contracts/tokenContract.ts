import { ethers } from "ethers";
import { Contract } from "./contract";

const tokenAddress: `0x${string}` =
  "0xD7B871C81805d214a3E5D8D2ceB15807bdc4eCb4";

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

const erc20AbiInterface = new ethers.Interface(erc20Abi);

export const tokenContract = new Contract(tokenAddress, erc20AbiInterface);

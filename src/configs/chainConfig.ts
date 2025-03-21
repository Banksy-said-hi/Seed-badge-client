import { CHAIN_NAMESPACES } from "@web3auth/base";
import {
  AccountAbstractionProvider,
  SafeSmartAccount,
} from "@web3auth/account-abstraction-provider";
import { ethers } from "ethers";

const pimlicoAPIKey = "pim_XE7CUZced67FhiEqXyEJPZ";

// TODO Replace with PETAL token address
export const tokenAddress: `0x${string}` =
  "0x5fd84259d66Cd46123540766Be93DFE6D43130D7";

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa37dc", // Please use 0x1 for Mainnet
  rpcTarget:
    "https://optimism-sepolia.infura.io/v3/06f3f78b0f324d9c8cde54f90cd4fb5b",
  displayName: "Optimism Sepolia",
  blockExplorerUrl: "https://sepolia-optimism.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://res.coinpaper.com/coinpaper/optimism_logo_6eba6a0c5c.png",
};

// Get the pimlico API Key from dashboard.pimlico.io
const pimlicoUrl = `https://api.pimlico.io/v2/${parseInt(
  chainConfig.chainId,
  16
)}/rpc?apikey=${pimlicoAPIKey}`;

export const accountAbstractionProvider = new AccountAbstractionProvider({
  config: {
    chainConfig,
    smartAccountInit: new SafeSmartAccount(),
    bundlerConfig: {
      url: pimlicoUrl,
    },
    paymasterConfig: {
      url: pimlicoUrl,
    },
  },
});

const abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

export const abiInterface = new ethers.Interface(abi);

const chainMap: { [key: number]: string } = {
  1: "Ethereum Mainnet",
  11155420: "Optimism Sepolia",
};

export function resolveChainId(chainId: number): string {
  return chainMap[chainId] || chainId.toString();
}

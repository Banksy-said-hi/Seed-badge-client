import { CHAIN_NAMESPACES } from "@web3auth/base";

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa37dc", // Please use 0x1 for Mainnet
  rpcTarget: "https://sepolia.optimism.io",
  displayName: "Optimism Sepolia",
  blockExplorerUrl: "https://sepolia-optimism.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://res.coinpaper.com/coinpaper/optimism_logo_6eba6a0c5c.png",
};

const chainMap: { [key: number]: string } = {
  1: "Ethereum Mainnet",
  11155420: "Optimism Sepolia",
};

export function resolveChainId(chainId: number): string {
  return chainMap[chainId] || chainId.toString();
}

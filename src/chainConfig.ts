import { CHAIN_NAMESPACES } from "@web3auth/base";
import {
  AccountAbstractionProvider,
  SafeSmartAccount,
} from "@web3auth/account-abstraction-provider";

const pimlicoAPIKey = "pim_XE7CUZced67FhiEqXyEJPZ";

// TODO Replace with PETAL token address
export const tokenAddress: `0x${string}` =
  "0x5fd84259d66Cd46123540766Be93DFE6D43130D7";

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

export const accountAbstractionProvider = new AccountAbstractionProvider({
  config: {
    chainConfig,
    smartAccountInit: new SafeSmartAccount(),
    bundlerConfig: {
      // Get the pimlico API Key from dashboard.pimlico.io
      url: `https://api.pimlico.io/v2/${parseInt(
        chainConfig.chainId,
        16
      )}/rpc?apikey=${pimlicoAPIKey}`,
    },
  },
});

const chainMap: { [key: number]: string } = {
  1: "Ethereum Mainnet",
  11155420: "Optimism Sepolia",
};

export function resolveChainId(chainId: number): string {
  return chainMap[chainId] || chainId.toString();
}

import { CHAIN_NAMESPACES } from "@web3auth/base";
import {
  AccountAbstractionProvider,
  SafeSmartAccount,
} from "@web3auth/account-abstraction-provider";

const pimlicoAPIKey = "pim_XE7CUZced67FhiEqXyEJPZ";

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa37dc", // Please use 0x1 for Mainnet
  rpcTarget: "https://optimism-sepolia.infura.io/v3/06f3f78b0f324d9c8cde54f90cd4fb5b",
  wsTarget: "wss://optimism-sepolia.infura.io/ws/v3/06f3f78b0f324d9c8cde54f90cd4fb5b",
  displayName: "Optimism Sepolia",
  blockExplorerUrl: "https://sepolia-optimism.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://res.coinpaper.com/coinpaper/optimism_logo_6eba6a0c5c.png",
};

// Get the pimlico API Key from dashboard.pimlico.io
const pimlicoUrl = `https://api.pimlico.io/v2/${parseInt(
  chainConfig.chainId,
  16,
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

const chainMap: { [key: number]: string } = {
  1: "Ethereum Mainnet",
  11155420: "Optimism Sepolia",
};

export function resolveChainId(chainId: number): string {
  return chainMap[chainId] || chainId.toString();
}

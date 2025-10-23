import { CHAIN_NAMESPACES } from "@web3auth/base";
import {
  AccountAbstractionProvider,
  SafeSmartAccount,
} from "@web3auth/account-abstraction-provider";

const pimlicoAPIKey = "pim_XE7CUZced67FhiEqXyEJPZ";

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7", // Ethereum Sepolia
  rpcTarget: "https://sepolia.infura.io/v3/06f3f78b0f324d9c8cde54f90cd4fb5b",
  wsTarget: "wss://sepolia.infura.io/ws/v3/06f3f78b0f324d9c8cde54f90cd4fb5b",
  displayName: "Ethereum Sepolia",
  blockExplorerUrl: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp",
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
  11155111: "Ethereum Sepolia",
};

export function resolveChainId(chainId: number): string {
  return chainMap[chainId] || chainId.toString();
}

import { CHAIN_NAMESPACES } from "@web3auth/base";
import {
  AccountAbstractionProvider,
  SafeSmartAccount,
} from "@web3auth/account-abstraction-provider";

const pimlicoAPIKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY || "";
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || "";

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7", // Ethereum Sepolia
  rpcTarget: `https://sepolia.infura.io/v3/${infuraApiKey}`,
  wsTarget: `wss://sepolia.infura.io/ws/v3/${infuraApiKey}`,
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

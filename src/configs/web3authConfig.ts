import type { IWeb3AuthCoreOptions } from "@web3auth/base";
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { chainConfig, accountAbstractionProvider } from "./chainConfig";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

export const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig: chainConfig,
  },
});

export const web3authOptions: IWeb3AuthCoreOptions = {
  clientId: clientId, // Get your Client ID from the Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // Use DEVNET for testing, MAINNET for production
  storageKey: "local",
  privateKeyProvider,
  accountAbstractionProvider,
  useAAWithExternalWallet: false,
  useCoreKitKey: true,
};

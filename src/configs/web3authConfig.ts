import type { IWeb3AuthCoreOptions } from "@web3auth/base";
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { chainConfig, accountAbstractionProvider } from "./chainConfig";

// Web3Auth Client ID for Klang dApp with JWKS configuration
const clientId =
  "BNUQornMJd68u-DaijSCW6D-SgFkC4ihAUYKkjN2h-fWwU79U8HEAM4iyJQMruAZJLJyhErkhaNPUNK6f6BFLzw";

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

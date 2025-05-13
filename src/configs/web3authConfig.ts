import { IWeb3AuthCoreOptions, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { chainConfig, accountAbstractionProvider } from "./chainConfig";

const clientId =
  "BBciNB8_-ajaAbCTCcMlMFEkbRQn5l5C5BrYq25liwjWtm98X92ZmseHAE014DqyZxWcqi9pyR_0FkgEtZ4sQSY";

export const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig: chainConfig,
  },
});

export const web3authOptions: IWeb3AuthCoreOptions = {
  clientId: clientId, // Get your Client ID from the Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  storageKey: "local",
  privateKeyProvider,
  accountAbstractionProvider,
  useAAWithExternalWallet: false,
  useCoreKitKey: true,
};

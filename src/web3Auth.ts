import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, UX_MODE } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { AuthAdapter, WHITE_LABEL_THEME, WhiteLabelData } from "@web3auth/auth-adapter";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1", // Please use 0x1 for Mainnet
    rpcTarget: "https://rpc.ankr.com/eth",
    displayName: "Ethereum Mainnet",
    blockExplorerUrl: "https://etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://images.toruswallet.io/eth.svg",
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: {
      chainConfig,
    },
  });

  const web3Auth = new Web3AuthNoModal({
    clientId: "BBciNB8_-ajaAbCTCcMlMFEkbRQn5l5C5BrYq25liwjWtm98X92ZmseHAE014DqyZxWcqi9pyR_0FkgEtZ4sQSY", // Get your Client ID from the Web3Auth Dashboard
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    storageKey: "local",
    privateKeyProvider,
  });

  const authAdapter = new AuthAdapter({
    adapterSettings: {
      // clientId, // Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
      // network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
      uxMode: UX_MODE.REDIRECT,
      whiteLabel: {
        appName: "Klang",
        appUrl: "https://www.klang-games.com/",
        logoLight: "https://web3auth.io/images/web3auth-logo.svg",
        logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
        defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl, tr
        mode: "auto", // whether to enable dark mode. defaultValue: auto
        theme: {
          primary: "#00D1B2",
        } as WHITE_LABEL_THEME,
        useLogoLoader: true,
      } as WhiteLabelData,
      loginConfig:{
        jwt: {
          verifier: "klang", // Name of the verifier created on Web3Auth Dashboard
          typeOfLogin: "jwt",
          clientId: "b17dec48-2a07-4c12-9cda-8778d9209707", // Web3Auth Client ID
        } 
      }
    },
    loginSettings: {
        mfaLevel: "optional"
    },
    privateKeyProvider,
  });

  web3Auth.configureAdapter(authAdapter);

  const walletServicesPlugin = new WalletServicesPlugin();

  web3Auth.addPlugin(walletServicesPlugin);


  export async function initialize() {
    await web3Auth.init();
  }

  export const web3AuthInstance = web3Auth;
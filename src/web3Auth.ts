import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, UX_MODE} from "@web3auth/base";
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

  const web3auth = new Web3Auth({
    clientId: "BPWmcBa2DZfRL6FYnz7ZdwiMKhUu32QdfWoR3LxjeW2vvruPCqZ0G-ojeniQyVaOg1jTZbEmOrZqRQWYFA21Opg", // Get your Client ID from the Web3Auth Dashboard
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
    uiConfig: {
        appName: "W3A Heroes",
        appUrl: "https://web3auth.io",
        logoLight: "https://web3auth.io/logo-light.png",
        logoDark: "https://web3auth.io/logo-dark.png",
        defaultLanguage: "en",
        mode: "auto",
        useLogoLoader: true,
      },
  });

  const authAdapter = new AuthAdapter({
    adapterSettings: {
      //clientId, // Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
      // network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
      uxMode: UX_MODE.REDIRECT,
      whiteLabel: {
        appName: "W3A Heroes",
        appUrl: "https://web3auth.io",
        logoLight: "https://web3auth.io/images/web3auth-logo.svg",
        logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
        defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl, tr
        mode: "auto", // whether to enable dark mode. defaultValue: auto
        theme: {
          primary: "#00D1B2",
        } as WHITE_LABEL_THEME,
        useLogoLoader: true,
      } as WhiteLabelData,
    },
    loginSettings: {
        mfaLevel: "optional"
    },
    privateKeyProvider,
  });

  web3auth.configureAdapter(authAdapter);

  export const initWeb3Auth = async () => {
    await web3auth.initModal();
    
    //TODO: This is for testing purposes only. Please remove this line in production.
    if (web3auth.connected) {
      await web3auth.logout();
    }
    
};

export const connect = async () => {
  return await web3auth.connect();
};
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, UX_MODE, WALLET_ADAPTERS } from "@web3auth/base";
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

  const web3Auth = new Web3Auth({
    clientId: "BBciNB8_-ajaAbCTCcMlMFEkbRQn5l5C5BrYq25liwjWtm98X92ZmseHAE014DqyZxWcqi9pyR_0FkgEtZ4sQSY", // Get your Client ID from the Web3Auth Dashboard
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
    uiConfig: {
        appName: "Klang",
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
      // clientId, // Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
      // network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
      uxMode: UX_MODE.POPUP,
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
      loginConfig:{
        google: {
          verifier: "google_test", // Pass the Verifier name here
          typeOfLogin: "google", // Pass on the login provider of the verifier you've created
          clientId: "229577254612-np5j8aqqck2qf4aaa8ioo5qgl3j8nkq6.apps.googleusercontent.com", // Pass on the Google `Client ID` here
        }, 
      }
    },
    loginSettings: {
        mfaLevel: "optional"
    },
    privateKeyProvider,
  });

  web3Auth.configureAdapter(authAdapter);

  export async function initialize() {
    await web3Auth.initModal({
      modalConfig: {
        [WALLET_ADAPTERS.AUTH]: {
          label: "auth",
          loginMethods: {
            google: {
              name: "Google",
            },
            twitter: {
              name: 'twitter',
              showOnModal: false,
            },
            facebook: {
              name: 'facebook',
              showOnModal: false,
            },
            github: {
              name: 'github',
              showOnModal: false,
            },
            reddit: {
              name: 'reddit',
              showOnModal: false,
            },
            discord: {
              name: 'discord',
              showOnModal: false,
            },
            twitch: {
              name: 'twitch',
              showOnModal: false,
            },
            apple: {
              name: 'apple',
              showOnModal: false,
            },
            line: {
              name: 'line',
              showOnModal: false,
            },
            kakao: {
              name: 'kakao',
              showOnModal: false,
            },
            linkedin: {
              name: 'linkedin',
              showOnModal: false,
            },
            weibo: {
              name: 'weibo',
              showOnModal: false,
            },
            wechat: {
              name: 'wechat',
              showOnModal: false,
            },
            farcaster:{
              name: 'farcaster',
              showOnModal: false,
            },
            email_passwordless: {
              name: "email_passwordless",
              showOnModal: false,
            },
            sms_passwordless: {
              name: "sms_passwordless",
              showOnModal: false,
            },
          },
          // setting it to false will hide all social login methods from modal.
          showOnModal: true,
        },
      },
    });
  }

  export const web3AuthInstance = web3Auth;
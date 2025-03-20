import { UX_MODE } from "@web3auth/auth-adapter";
import {
  AuthAdapter,
  WHITE_LABEL_THEME,
  WhiteLabelData,
} from "@web3auth/auth-adapter";
import { privateKeyProvider } from "./web3authConfig";

export const oAuthClientId = "b17dec48-2a07-4c12-9cda-8778d9209707";

export const authAdapter = new AuthAdapter({
  adapterSettings: {
    // clientId, // Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
    // network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
    uxMode: UX_MODE.REDIRECT,
    whiteLabel: {
      appName: "Klang",
      appUrl: "https://www.klang-games.com/",
      logoLight:
        "https://images.ctfassets.net/wwc86iwkmz4s/6wFkwmrdsohwk3Qr09Yoj8/43182090215ef1f19217c073cd7893e1/icon-logo.svg",
      logoDark:
        "https://images.ctfassets.net/wwc86iwkmz4s/6wFkwmrdsohwk3Qr09Yoj8/43182090215ef1f19217c073cd7893e1/icon-logo.svg",
      defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl, tr
      mode: "auto", // whether to enable dark mode. defaultValue: auto
      theme: {
        primary: "#00D1B2",
      } as WHITE_LABEL_THEME,
      useLogoLoader: true,
    } as WhiteLabelData,
    loginConfig: {
      jwt: {
        verifier: "klang", // Name of the verifier created on Web3Auth Dashboard
        typeOfLogin: "jwt",
        clientId: oAuthClientId, // OAuth Client ID
      },
    },
  },
  loginSettings: {
    mfaLevel: "optional",
  },
  privateKeyProvider,
});

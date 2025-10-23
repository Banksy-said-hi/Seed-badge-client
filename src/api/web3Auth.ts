import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { ADAPTER_EVENTS, type RequestArguments, type WALLET_ADAPTER_TYPE } from "@web3auth/base";
import type { LoginParams } from "@web3auth/auth-adapter";

import { web3authOptions } from "../configs/web3authConfig";
import { authAdapter } from "../configs/authConfig";
import { resolveChainId } from "../configs/chainConfig";
import type { AccountPair } from "../types";

export const web3Auth = new Web3AuthNoModal(web3authOptions);

export let accountPair: Promise<AccountPair>;

export let verifierId: Promise<string>;

async function reset() {
  accountPair = new Promise<AccountPair>((resolve) => {
    web3Auth.on(ADAPTER_EVENTS.CONNECTED, async () => {
      resolve(await getConnectedAccountPair());
    });
  });

  verifierId = new Promise<string>((resolve) => {
    web3Auth.on(ADAPTER_EVENTS.CONNECTED, async () => {
      const result = await web3Auth.getUserInfo();
      resolve(result.verifierId || result.email || "");
    });
  });
}

web3Auth.on(ADAPTER_EVENTS.DISCONNECTED, async () => {
  reset();
});

export async function initialize() {
  reset();

  web3Auth.configureAdapter(authAdapter);

  const walletServicesPlugin = new WalletServicesPlugin();

  web3Auth.addPlugin(walletServicesPlugin);

  const urlParams = new URLSearchParams(window.location.search);

  // For some reason web3Auth.init() removes the state from the URL query params
  window.localStorage.setItem("oauth_state", urlParams.get("state") || "");

  await web3Auth.init();
}

const getConnectedAccountPair = async (): Promise<AccountPair> => {
  const accounts: string[] = await request({
    method: "eth_accounts",
    params: [],
  });

  if (accounts.length < 2) {
    throw new Error("No connected account pair found");
  }

  return {
    smartAccount: accounts[0] as `0x${string}`,
    externalAccount: accounts[1] as `0x${string}`,
  };
};

export const getChain = async (): Promise<string> => {
  const chainIdHex: string = await request({
    method: "eth_chainId",
    params: [],
  });

  return resolveChainId(parseInt(chainIdHex, 16));
};

export const signMessage = async (message: string): Promise<string> => {
  const account = (await accountPair).smartAccount;

  const signature: string = await request({
    method: "personal_sign",
    params: [message, account],
  });

  return signature;
};

export async function request<S, R>(args: RequestArguments<S>): Promise<R> {
  if (!web3Auth.connected) {
    throw new Error("Web3Auth not connected");
  }

  const result = await web3Auth.provider?.request<S, R>(args);

  if (!result) {
    throw new Error("Failed to make request: " + JSON.stringify(args));
  }

  return result as R;
}

export async function connect(adapterType: WALLET_ADAPTER_TYPE, loginParams: LoginParams) {
  await web3Auth.connectTo<LoginParams>(adapterType, loginParams);
}

export async function disconnect() {
  await web3Auth.logout();
}

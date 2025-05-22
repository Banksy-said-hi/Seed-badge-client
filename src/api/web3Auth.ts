import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import {
  ADAPTER_EVENTS,
  RequestArguments,
  WALLET_ADAPTER_TYPE,
} from "@web3auth/base";
import { LoginParams } from "@web3auth/auth-adapter";

import { web3authOptions } from "../configs/web3authConfig";
import { authAdapter } from "../configs/authConfig";
import { resolveChainId } from "../configs/chainConfig";
import { AccountPair } from "../types/AccountPair";
import { Token } from "../types/Token";
import { tokenContract } from "../contracts/tokenContract";

export const web3Auth = new Web3AuthNoModal(web3authOptions);

export let accountPair: Promise<AccountPair>;

export let token: Promise<Token>;

export let verifierId: Promise<string>;

async function reset() {
  accountPair = new Promise<AccountPair>((resolve) => {
    web3Auth.on(ADAPTER_EVENTS.CONNECTED, async () => {
      resolve(await getConnectedAccountPair());
    });
  });

  token = new Promise<Token>((resolve) => {
    web3Auth.on(ADAPTER_EVENTS.CONNECTED, async () => {
      const symbol = await tokenContract.read<string>("symbol");

      const decimals = await tokenContract.read<number>("decimals");

      resolve({ symbol: symbol, decimals: decimals });
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
  const chainIdHex: string = await request({ method: "eth_chainId", params: [] });

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

export async function connect(
  adapterType: WALLET_ADAPTER_TYPE,
  loginParams: LoginParams
) {
  await web3Auth.connectTo<LoginParams>(adapterType, loginParams);
}

export async function disconnect() {
  await web3Auth.logout();
}

export async function getTokenBalance() {
  const account = (await accountPair).smartAccount;

  return tokenContract.read<number>("balanceOf", [account]);
}

// 10 USDC
export async function getTokenBalanceWithSymbol() {
  const balance = await getTokenBalance();

  return `${await formatUnitsFromBaseUnit(balance)} ${(await token).symbol}`;
}

export async function transferTokens(
  to: string,
  amount: bigint
): Promise<string> {
  return tokenContract.send("transfer", [to, amount]);
}

export async function formatUnitsFromBaseUnit(value: number) {
  const decimals = (await token).decimals;

  return BigInt(value) / 10n ** BigInt(decimals);
}

export async function formatUnitsToBaseUnit(value: number) {
  const decimals = (await token).decimals;

  return BigInt(value) * 10n ** BigInt(decimals);
}

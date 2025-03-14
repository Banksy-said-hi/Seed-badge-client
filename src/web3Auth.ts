import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import {
  ADAPTER_EVENTS,
  RequestArguments,
  WALLET_ADAPTER_TYPE,
} from "@web3auth/base";
import { LoginParams } from "@web3auth/auth-adapter";
import {
  createPublicClient,
  PublicClient,
  formatUnits,
  custom,
  erc20Abi,
} from "viem";

import { web3authOptions } from "./web3authConfig";
import { authAdapter } from "./authConfig";
import { resolveChainId, tokenAddress } from "./chainConfig";
import { AccountPair } from "./types/AccountPair";

export const web3auth = new Web3AuthNoModal(web3authOptions);

export let accountPair: AccountPair = null;

let viemPublicClient: PublicClient;

export async function initialize() {
  web3auth.on(ADAPTER_EVENTS.CONNECTED, async (data) => {
    viemPublicClient = createPublicClient({
      transport: custom(data.provider),
    });
  });

  web3auth.on(ADAPTER_EVENTS.DISCONNECTED, async () => {
    accountPair = null;
  });

  web3auth.configureAdapter(authAdapter);

  const walletServicesPlugin = new WalletServicesPlugin();

  web3auth.addPlugin(walletServicesPlugin);

  await web3auth.init();
}

export const getConnectedAccountPair = async (): Promise<AccountPair> => {
  if (accountPair) {
    return accountPair;
  }

  let accounts: string[] = await request({
    method: "eth_accounts",
    params: [],
  });

  if (accounts.length < 2) {
    throw new Error("No connected account pair found");
  }

  accountPair = { smartAccount: accounts[0], externalAccount: accounts[1] };

  return accountPair;
};

export const getChain = async (): Promise<string> => {
  let chainIdHex: string = await request({ method: "eth_chainId", params: [] });

  return resolveChainId(parseInt(chainIdHex, 16));
};

export const signMessage = async (message: string): Promise<string> => {
  let account = (await getConnectedAccountPair())?.smartAccount;

  let signature: string = await request({
    method: "personal_sign",
    params: [message, account],
  });

  return signature;
};

async function request<S, R>(args: RequestArguments<S>): Promise<R> {
  if (!web3auth.connected) {
    throw new Error("Web3Auth not connected");
  }

  let result = await web3auth.provider?.request<S, R>(args);

  if (!result) {
    throw new Error("Failed to make request: " + JSON.stringify(args));
  }

  return result as R;
}

export async function connect(
  adapterType: WALLET_ADAPTER_TYPE,
  loginParams: LoginParams
) {
  await web3auth.connectTo<LoginParams>(adapterType, loginParams);
}

export async function disconnect() {
  await web3auth.logout();
}

export async function getTokenBalance() {
  const account = (await getConnectedAccountPair())?.smartAccount;

  // Get the raw token balance
  const balance = await viemPublicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account as `0x${string}`],
  });

  const decimals = await viemPublicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });

  return formatUnits(balance, decimals);
}

// 10 USDC
export async function getTokenBalanceWithSymbol() {
  const symbol = await viemPublicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "symbol",
  });

  return `${await getTokenBalance()} ${symbol}`;
}

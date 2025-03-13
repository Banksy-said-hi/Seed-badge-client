import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { RequestArguments, WALLET_ADAPTER_TYPE } from "@web3auth/base";

import { web3authOptions } from "./web3authConfig";
import { authAdapter } from "./authConfig";
import { resolveChainId } from "./chainConfig";
import { LoginParams } from "@web3auth/auth-adapter";

export const web3auth = new Web3AuthNoModal(web3authOptions);

export async function initialize() {
  web3auth.configureAdapter(authAdapter);

  const walletServicesPlugin = new WalletServicesPlugin();

  web3auth.addPlugin(walletServicesPlugin);

  await web3auth.init();
}

export const getConnectedAccount = async (): Promise<string> => {
  let accounts: string[] = await request({
    method: "eth_accounts",
    params: [],
  });

  if (accounts.length == 0) {
    throw new Error("No connected accounts found");
  }

  return accounts[0];
};

export const getChain = async (): Promise<string> => {
  let chainIdHex: string = await request({ method: "eth_chainId", params: [] });

  return resolveChainId(parseInt(chainIdHex, 16));
};

export const signMessage = async (message: string): Promise<string> => {
  let account = await getConnectedAccount();

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

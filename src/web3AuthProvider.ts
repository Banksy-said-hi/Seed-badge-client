import { web3AuthInstance } from "./web3Auth";
import { RequestArguments } from "@web3auth/base";
import { resolveChainId } from "./types/chain";

export const getConnectedAccount = async () : Promise<string> => {
    
    let accounts : string[] = await request({ method: "eth_accounts", params: [] });

    if (accounts.length == 0) {
        throw new Error("No connected accounts found");
    }

    return accounts[0];
}

export const getChain = async () : Promise<string> => {
    
    let chainIdHex : string = await request({ method: "eth_chainId", params: [] });

    return resolveChainId(parseInt(chainIdHex, 16));
}

export const signMessage = async (message : string) : Promise<string> => {
    
    let account = await getConnectedAccount();

    let signature : string = await request({ method: "personal_sign", params: [message, account] });

    return signature;
}

async function request<S, R>(args: RequestArguments<S>): Promise<R>
{
    if (!web3AuthInstance.connected) {
        throw new Error("Web3Auth not connected");
    }

    let result = await web3AuthInstance.provider?.request<S, R>(args);

    if (!result) {
        throw new Error("Failed to make request: " + JSON.stringify(args));
    }

    return result as R;
}
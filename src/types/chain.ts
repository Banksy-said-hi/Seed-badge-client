const chainMap: { [key: number]: string } = {
    1: 'Ethereum Mainnet',
};

export function resolveChainId(chainId: number): string {
    
    return chainMap[chainId] || chainId.toString();
}
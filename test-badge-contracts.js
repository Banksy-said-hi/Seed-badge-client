import { ethers } from 'ethers';

// Contract addresses from database
const contracts = [
  {
    name: "Foggy morning",
    address: "0x7e4A1A64e60a7556649c3230BF5bBF7cB0D49759",
    badgeId: "0x466f676779206d6f726e696e6720626164676520323032340000000000000000"
  },
  {
    name: "What is for breakfast dude", 
    address: "0x123185522A61A2A8f9575C8936E41337E80930E2",
    badgeId: "0x466f656779206d6f726e696e6720626164676520323032340000000000000000"
  },
  {
    name: "Scrambled Egg",
    address: "0x2b2E9cA88f23940A672b615682E4b2223f2eF340", 
    badgeId: "0x466f676279206d6f726e696e6720626164676520323032340000000000000000"
  }
];

// Badge contract ABI - let's try different possible function signatures
const ABIS = {
  get_bytes32: ["function get(bytes32) external view returns (bool)"],
  balanceOf: ["function balanceOf(address, uint256) external view returns (uint256)"],
  ownerOf: ["function ownerOf(uint256) external view returns (address)"],
  hasRole: ["function hasRole(bytes32, address) external view returns (bool)"],
  // Maybe it's a different function name?
  owns: ["function owns(bytes32) external view returns (bool)"],
  hasBadge: ["function hasBadge(bytes32) external view returns (bool)"]
};

async function testContracts() {
  // Ethereum Sepolia RPC endpoint (free public RPC)
  const provider = new ethers.JsonRpcProvider('https://rpc2.sepolia.org');
  
  const userHash = "0xe0b63d08cfda209dd675012512620b10b98f314e1f5b3fb977ddf0f50194a2f8";
  
  console.log('🧪 Testing Badge Contracts on Sepolia');
  console.log(`👤 User Hash: ${userHash}\n`);
  
  for (const contractInfo of contracts) {
    console.log(`🏷️  Testing: ${contractInfo.name}`);
    console.log(`📍 Address: ${contractInfo.address}`);
    console.log(`🔑 BadgeId: ${contractInfo.badgeId}`);
    
    // First, check if contract exists
    try {
      const code = await provider.getCode(contractInfo.address);
      if (code === '0x') {
        console.log('❌ Contract does not exist at this address\n');
        continue;
      }
      console.log('✅ Contract exists');
    } catch (err) {
      console.log(`❌ Error checking contract existence: ${err.message}\n`);
      continue;
    }
    
    // Test different function signatures
    for (const [abiName, abi] of Object.entries(ABIS)) {
      try {
        const contract = new ethers.Contract(contractInfo.address, abi, provider);
        
        if (abiName === 'get_bytes32' || abiName === 'owns' || abiName === 'hasBadge') {
          // Test with user hash
          const result = await contract[Object.keys(contract.interface.functions)[0]](userHash);
          console.log(`  📋 ${abiName}(userHash): ${result}`);
          
          // Also test with the contract's own badgeId
          const resultBadgeId = await contract[Object.keys(contract.interface.functions)[0]](contractInfo.badgeId);
          console.log(`  📋 ${abiName}(badgeId): ${resultBadgeId}`);
          
        } else if (abiName === 'balanceOf') {
          // Test balanceOf - need to derive address from hash first
          // This is just a test to see if it's an ERC1155
          try {
            const result = await contract.balanceOf("0x" + userHash.slice(26), 1); // Extract potential address
            console.log(`  📋 ${abiName}: ${result}`);
          } catch {}
          
        } else if (abiName === 'hasRole') {
          // Test hasRole with user hash as role and some address
          try {
            const result = await contract.hasRole(userHash, "0x" + userHash.slice(26));
            console.log(`  📋 ${abiName}: ${result}`);
          } catch {}
        }
        
      } catch (err) {
        console.log(`  ❌ ${abiName}: ${err.reason || err.message}`);
      }
    }
    console.log('');
  }
}

testContracts().catch(console.error);
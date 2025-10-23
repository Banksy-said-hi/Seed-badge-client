import { ethers } from 'ethers';

async function quickTest() {
  // Ethereum Sepolia with your Infura key
  const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/06f3f78b0f324d9c8cde54f90cd4fb5b');
  
  const userHash = "0xe0b63d08cfda209dd675012512620b10b98f314e1f5b3fb977ddf0f50194a2f8";
  
  const contracts = [
    {
      name: "Foggy morning",
      address: "0x7e4A1A64e60a7556649c3230BF5bBF7cB0D49759"
    },
    {
      name: "What is for breakfast dude", 
      address: "0x123185522A61A2A8f9575C8936E41337E80930E2"
    },
    {
      name: "Scrambled Egg",
      address: "0x2b2E9cA88f23940A672b615682E4b2223f2eF340"
    }
  ];
  
  const abi = ["function get(bytes32) external view returns (bool)"];
  
  console.log('🧪 Testing Badge Contracts on Ethereum Sepolia');
  console.log(`👤 User Hash: ${userHash}\n`);
  
  for (const contractInfo of contracts) {
    try {
      console.log(`🏷️  ${contractInfo.name}`);
      
      // Check if contract exists
      const code = await provider.getCode(contractInfo.address);
      if (code === '0x') {
        console.log('❌ Contract not found');
        continue;
      }
      console.log('✅ Contract exists');
      
      // Try to call get() function
      const contract = new ethers.Contract(contractInfo.address, abi, provider);
      const owns = await contract.get(userHash);
      console.log(`🔍 get(${userHash.slice(0,10)}...): ${owns}`);
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('');
  }
}

quickTest().catch(console.error);
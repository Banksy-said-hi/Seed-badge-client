const { ethers } = require('ethers');
const crypto = require('crypto');

// Your contract addresses from database
const contractAddresses = [
  "0x1a82f6f5bbe8fa87b15a1d5fdcb4ff925ea5b609",
  "0x7ac744b1e020bda5e289002b2737ba9403ceb16c"
];

// Badge contract ABI - just the get function
const BADGE_ABI = [
  "function get(bytes32) external view returns (bool)"
];

// Test different hash variations
function generateHashes(fusionAuthId) {
  const hashes = {};
  
  // Current method (what we're using)
  hashes.currentMethod = ethers.keccak256(ethers.toUtf8Bytes(`klang${fusionAuthId}`));
  
  // Alternative methods to try
  hashes.noSalt = ethers.keccak256(ethers.toUtf8Bytes(fusionAuthId));
  hashes.differentSalt = ethers.keccak256(ethers.toUtf8Bytes(`badge${fusionAuthId}`));
  hashes.rawBytes = ethers.keccak256(ethers.toUtf8Bytes(fusionAuthId));
  
  return hashes;
}

async function testContract() {
  // Use a public RPC (replace with your actual RPC)
  const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com/');
  
  const fusionAuthId = "23222be4-b33b-486f-9683-879b2554d510"; // Your actual ID
  const hashes = generateHashes(fusionAuthId);
  
  console.log('\n📋 Testing with FusionAuth ID:', fusionAuthId);
  console.log('\n🔑 Generated hashes:');
  Object.entries(hashes).forEach(([method, hash]) => {
    console.log(`  ${method}: ${hash}`);
  });
  
  for (const contractAddress of contractAddresses) {
    console.log(`\n🏢 Testing contract: ${contractAddress}`);
    
    try {
      const contract = new ethers.Contract(contractAddress, BADGE_ABI, provider);
      
      // Test each hash method
      for (const [method, hash] of Object.entries(hashes)) {
        try {
          const result = await contract.get(hash);
          console.log(`  ✅ ${method}: ${result}`);
          if (result) {
            console.log(`  🎉 FOUND MATCH with method: ${method}`);
          }
        } catch (err) {
          console.log(`  ❌ ${method}: Error - ${err.message}`);
        }
      }
    } catch (err) {
      console.log(`  💥 Contract call failed: ${err.message}`);
    }
  }
}

// Also test if we can call the contract at all
async function testBasicCall() {
  const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com/');
  
  console.log('\n🔧 Testing basic contract connectivity...');
  
  for (const contractAddress of contractAddresses) {
    try {
      const code = await provider.getCode(contractAddress);
      console.log(`Contract ${contractAddress} exists:`, code !== '0x');
    } catch (err) {
      console.log(`Contract ${contractAddress} check failed:`, err.message);
    }
  }
}

// Run the tests
testBasicCall().then(() => testContract()).catch(console.error);
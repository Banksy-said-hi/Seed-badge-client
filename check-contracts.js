import { PrismaClient } from './src/generated/prisma/index.js';

async function checkContracts() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Fetching contracts from database...\n');
    
    const contracts = await prisma.contract.findMany({
      select: {
        id: true,
        address: true,
        name: true,
        network: true,
        badgeId_bytes32: true,
        verified: true
      }
    });
    
    console.log(`📊 Found ${contracts.length} contracts:\n`);
    
    contracts.forEach((contract, index) => {
      console.log(`${index + 1}. ${contract.name || 'Unnamed'}`);
      console.log(`   Address: ${contract.address}`);
      console.log(`   Network: ${contract.network}`);
      console.log(`   BadgeId: ${contract.badgeId_bytes32}`);
      console.log(`   Verified: ${contract.verified}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkContracts();
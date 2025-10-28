import React, { useEffect, useState } from 'react';
import { useAllContracts } from '../hooks/useContracts';

import { Loading } from './Loading';
import { Contract as OnchainContract } from '../contracts/contract';
import { ethers } from 'ethers';
import { getHashedFusionAuthId } from '../api/fusionAuth';

// Badge contract interface for the get() function
const BADGE_IFACE = new ethers.Interface([
  'function get(bytes32) external view returns (bool)'
]);

export default function ContractsList() {
  const { contracts: allContracts, error, isLoading } = useAllContracts();
  const [ownedBadges, setOwnedBadges] = useState<any[]>([]);
  const [isCheckingOwnership, setIsCheckingOwnership] = useState(false);

  useEffect(() => {
    async function checkOwnership() {
      if (!allContracts?.length) return;

      setIsCheckingOwnership(true);

      try {
        const userIdResult = await getHashedFusionAuthId();
        
        if (!userIdResult.hashedId) {
          setOwnedBadges([]);
          return;
        }
        
        const userId = userIdResult.hashedId;

        // Sequential processing with delays to avoid rate limiting
        const owned = [];
        
        for (let i = 0; i < allContracts.length; i++) {
          const contract = allContracts[i];
          try {
            const onchain = new OnchainContract(contract.address, BADGE_IFACE);
            const owns = await onchain.read<boolean>('get', [userId]);
            
            if (owns) {
              owned.push(contract);
            }
            
            // Add 300ms delay between checks to avoid rate limiting
            if (i < allContracts.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          } catch (err) {
            // Silent error handling
          }
        }
        
        setOwnedBadges(owned);
      } catch (error) {
        setOwnedBadges([]);
      } finally {
        setIsCheckingOwnership(false);
      }
    }

    checkOwnership();
  }, [allContracts]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error loading badges</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          My Badges
        </h2>
        <button 
          onClick={() => window.location.reload()} 
          className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-emerald-400/20"
        >
          <svg className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {isCheckingOwnership && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800 text-sm">Loading your badges...</span>
          </div>
        </div>
      )}

      {!isCheckingOwnership && ownedBadges.length === 0 && (
        <div className="text-center py-16">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
              <div className="text-4xl text-gray-400">🏆</div>
            </div>
            <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Your Badge Collection Awaits</h3>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            Complete activities and challenges to earn your first badge. Each badge represents a unique achievement in your journey!
          </p>
          <div className="mt-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-sm text-blue-700">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              Ready to earn badges on Ethereum Sepolia
            </div>
          </div>
        </div>
      )}

      {!isCheckingOwnership && ownedBadges.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ownedBadges.map((badge) => (
            <div 
              key={badge.id}
              className="relative group"
            >
              {/* Badge Card */}
              <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 right-2 text-6xl">🏆</div>
                  <div className="absolute bottom-2 left-2 text-4xl opacity-50">✨</div>
                </div>
                
                {/* Achievement Ribbon */}
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-bl-lg rounded-tr-2xl text-xs font-bold shadow-md">
                  EARNED
                </div>
                
                {/* Badge Content */}
                <div className="relative z-10">
                  {/* Badge Icon/Medal */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <div className="text-2xl">🎖️</div>
                    </div>
                  </div>
                  
                  {/* Badge Name */}
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-3 leading-tight">
                    {badge.name || 'Achievement Badge'}
                  </h3>
                  
                  {/* Badge Details */}
                  <div className="space-y-2">
                    {/* Network Badge */}
                    <div className="flex justify-center">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {badge.network?.toUpperCase() || 'SEPOLIA'}
                      </span>
                    </div>
                    
                    {/* Earned Date */}
                    <p className="text-sm text-gray-600 text-center font-medium">
                      Earned {new Date(badge.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    
                    {/* Contract Address (Hover to show) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-xs text-gray-500 text-center font-mono bg-white/70 rounded px-2 py-1 truncate" title={badge.address}>
                        {badge.address}
                      </p>
                    </div>
                  </div>
                  
                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 ease-in-out"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
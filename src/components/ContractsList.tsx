'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAllContracts } from '../hooks/useContracts';
import type { Contract } from '../lib/db';
import { getHashedFusionAuthId } from '../api/fusionAuth';
import { Contract as OnchainContract } from '../contracts/contract';
import { Interface } from 'ethers';

/**
 * Individual contract card component
 */
interface ContractCardProps {
  contract: Contract;
}

function ContractCard({ contract }: ContractCardProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getVerificationStatusColor = (status: string | null) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'FAILED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'ALREADY_VERIFIED':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {contract.name || 'Unnamed Contract'}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Address:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                {formatAddress(contract.address)}
              </code>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Network:</span>
              <span className="capitalize font-medium text-blue-600">
                {contract.network}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Created:</span>
              <span>{formatDate(contract.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getVerificationStatusColor(contract.verificationStatus)}`}>
          {contract.verified ? '✓ Verified' : contract.verificationStatus || 'Unknown'}
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        {contract.badgeId_bytes32 && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Badge ID:</span>
            <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded font-mono">
              {contract.badgeId_bytes32.slice(0, 10)}...
            </code>
          </div>
        )}
        
        {contract.etherscanGuid && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Etherscan:</span>
            <a 
              href={`https://etherscan.io/address/${contract.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              View on Etherscan ↗
            </a>
          </div>
        )}

        {contract.verificationUrl && (
          <div className="text-sm">
            <a 
              href={contract.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View Verification ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function ContractSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="border-t pt-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
}

function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-600 text-lg font-medium mb-2">
        Failed to Load Contracts
      </div>
      <p className="text-red-700 mb-4">{error.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-gray-500 text-lg font-medium mb-2">
        No Contracts Found
      </div>
      <p className="text-gray-400">
        There are no contracts available at the moment.
      </p>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useAllContracts } from '../hooks/useContracts';
import Card from './Card';
import Loading from './Loading';
import { Contract } from '@klang/klang-js-sdk';
import { ethers } from 'ethers';
import { getHashedFusionAuthId } from '../api/fusionAuth';

// Badge contract interface for the get() function
const BADGE_IFACE = new ethers.Interface([
  'function get(bytes32) external view returns (bool)'
]);

export default function ContractsList() {
  const { data: allContracts, error, isLoading } = useAllContracts();
  const [ownedBadges, setOwnedBadges] = useState<any[]>([]);
  const [isCheckingOwnership, setIsCheckingOwnership] = useState(false);

  useEffect(() => {
    async function checkOwnership() {
      if (!allContracts?.contracts?.length) return;

      setIsCheckingOwnership(true);

      try {
        const userId = await getHashedFusionAuthId();

        const ownershipPromises = allContracts.contracts.map(async (c: any) => {
            try {
              const onchain = new OnchainContract(c.address, BADGE_IFACE);
              const owns = await onchain.read<boolean>('get', [userId]);
              return owns ? c : null;
            } catch (err) {
              console.error('Badge ownership check failed for', c.address, err);
              return null;
            }
        });

        const results = await Promise.all(ownershipPromises);
        const owned = results.filter(c => c !== null);
        
        setOwnedBadges(owned);
      } catch (error) {
        console.error('Badge ownership check failed:', error);
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
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Refresh
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
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No badges yet</h3>
          <p className="text-gray-500">Complete activities to earn your first badge!</p>
        </div>
      )}

      {!isCheckingOwnership && ownedBadges.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ownedBadges.map((badge) => (
            <Card 
              key={badge.id} 
              contract={badge}
              showTransactionCount={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
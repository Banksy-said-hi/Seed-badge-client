import useSWR from 'swr';
import type { ContractsResponse } from '../app/api/contracts/route';

/**
 * Configuration options for the useContracts hook
 */
export interface UseContractsOptions {
  /** Number of contracts to fetch (default: 50, max: 100) */
  limit?: number;
  /** Number of contracts to skip for pagination (default: 0) */
  offset?: number;
  /** Filter by network (optional) */
  network?: string;
  /** Filter by verification status (optional) */
  verified?: boolean;
  /** Whether to automatically fetch data (default: true) */
  enabled?: boolean;
  /** Refresh interval in milliseconds (default: 5 minutes for read-only data) */
  refreshInterval?: number;
}

/**
 * SWR fetcher function for contracts API
 */
const fetcher = async (url: string): Promise<ContractsResponse> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: 'Failed to fetch contracts' 
    }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Custom hook for fetching contracts with SWR
 * Provides efficient data fetching, caching, and revalidation
 * 
 * @param options - Configuration options for the hook
 * @returns SWR response with contracts data, loading state, and utilities
 */
export function useContracts(options: UseContractsOptions = {}) {
  const {
    limit = 50,
    offset = 0,
    network,
    verified,
    enabled = true,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
  } = options;

  // Build query parameters
  const params = new URLSearchParams();
  
  if (limit !== 50) params.append('limit', limit.toString());
  if (offset !== 0) params.append('offset', offset.toString());
  if (network) params.append('network', network);
  if (verified !== undefined) params.append('verified', verified.toString());

  const queryString = params.toString();
  const url = `/api/contracts${queryString ? `?${queryString}` : ''}`;

  // SWR hook with configuration optimized for read-only data
  const {
    data,
    error,
    mutate,
    isLoading,
    isValidating
  } = useSWR(
    enabled ? url : null,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false, // Don't refetch on window focus (data doesn't change often)
      revalidateOnReconnect: true, // Refetch when reconnecting to internet
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      errorRetryCount: 3, // Retry failed requests 3 times
      errorRetryInterval: 1000, // Wait 1 second between retries
      keepPreviousData: true, // Keep previous data while loading new data
    }
  );

  /**
   * Manually refresh the contracts data
   */
  const refresh = () => mutate();

  /**
   * Check if there are more contracts to load (for pagination)
   */
  const hasMore = data?.metadata?.hasMore ?? false;

  /**
   * Get the next page of contracts
   */
  const loadNextPage = () => {
    if (!hasMore) return;
    
    // This would typically be handled by a pagination component
    // For now, we just return the next offset value
    return offset + limit;
  };

  return {
    /** Array of contract objects */
    contracts: data?.data ?? [],
    /** Response metadata including pagination info */
    metadata: data?.metadata,
    /** Whether the initial request is loading */
    isLoading,
    /** Whether any request is in progress (including revalidation) */
    isValidating,
    /** Error object if the request failed */
    error,
    /** Whether there are more contracts to load */
    hasMore,
    /** Function to manually refresh the data */
    refresh,
    /** Get the offset for the next page */
    getNextPageOffset: loadNextPage,
    /** Raw SWR mutate function for advanced usage */
    mutate,
  };
}

/**
 * Simplified hook for just getting all contracts without pagination
 * Useful for simple use cases where you just want to display all contracts
 */
export function useAllContracts() {
  return useContracts({ 
    limit: 100, // Get maximum allowed
    refreshInterval: 10 * 60 * 1000, // 10 minutes for simple use case
  });
}

/**
 * Hook for getting contracts by network
 * @param network - Network to filter by
 */
export function useContractsByNetwork(network: string) {
  return useContracts({ 
    network,
    enabled: Boolean(network),
  });
}

/**
 * Hook for getting only verified contracts
 */
export function useVerifiedContracts() {
  return useContracts({ 
    verified: true,
  });
}
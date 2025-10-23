import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import type { Contract } from '../../../lib/db';

// Configure route as dynamic since it accesses database
export const dynamic = 'force-dynamic';

/**
 * GET /api/contracts
 * Fetches all contracts from the database with optional filtering and pagination
 * 
 * Query parameters:
 * - limit: number of contracts to return (default: 50, max: 100)
 * - offset: number of contracts to skip (default: 0)
 * - network: filter by network (optional)
 * - verified: filter by verification status (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters with validation
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '50'), 
      100
    );
    const offset = Math.max(
      parseInt(searchParams.get('offset') || '0'), 
      0
    );
    const network = searchParams.get('network');
    const verified = searchParams.get('verified');

    console.log('API: Attempting to fetch contracts with params:', { limit, offset, network, verified });

    // Build filter conditions
    const where: any = {};
    
    if (network) {
      where.network = network;
    }
    
    if (verified !== null && verified !== undefined) {
      where.verified = verified === 'true';
    }

    console.log('API: Database where conditions:', where);

    // Test basic database connectivity first
    try {
      console.log('API: Testing database connection...');
      await db.$queryRaw`SELECT 1 as test`;
      console.log('API: Database connection successful');
    } catch (dbError) {
      console.error('API: Database connection failed:', dbError);
      throw new Error(`Database connection failed: ${dbError}`);
    }

    // Execute database query with proper error handling
    console.log('API: Executing contract queries...');
    const [contracts, totalCount] = await Promise.all([
      db.contract.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { createdAt: 'desc' },
          { name: 'asc' }
        ],
        select: {
          id: true,
          badgeId_bytes32: true,
          address: true,
          network: true,
          name: true,
          verified: true,
          verificationStatus: true,
          verificationUrl: true,
          verifiedAt: true,
          createdAt: true,
          updatedAt: true,
          etherscanGuid: true,
          // Optionally include transaction count
          _count: {
            select: {
              Transaction: true
            }
          }
        }
      }),
      
      // Get total count for pagination
      db.contract.count({ where })
    ]);

    console.log('API: Query results - contracts:', contracts.length, 'total:', totalCount);

    // Format response with metadata
    const response = {
      data: contracts,
      metadata: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + contracts.length < totalCount,
        filters: {
          network: network || null,
          verified: verified || null
        }
      }
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error fetching contracts:', error);
    
    // Return appropriate error response
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while fetching contracts';

    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Export types for client-side usage
 */
export type ContractsResponse = {
  data: Contract[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    filters: {
      network: string | null;
      verified: string | null;
    };
  };
};
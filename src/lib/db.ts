import { PrismaClient } from '../generated/prisma';

declare global {
  var __prisma: PrismaClient | undefined;
}

/**
 * Singleton Prisma client instance for read-only database operations
 * Prevents connection pool exhaustion in serverless environments
 */
class DatabaseClient {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) {
      // Use global variable in development to prevent hot reload issues
      if (process.env.NODE_ENV === 'development') {
        if (!global.__prisma) {
          global.__prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            errorFormat: 'pretty',
          });
        }
        DatabaseClient.instance = global.__prisma;
      } else {
        DatabaseClient.instance = new PrismaClient({
          log: ['error'],
          errorFormat: 'minimal',
        });
      }
    }

    return DatabaseClient.instance;
  }

  /**
   * Gracefully disconnect from database
   * Should be called during application shutdown
   */
  static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.$disconnect();
    }
  }

  /**
   * Test database connection
   * Useful for health checks
   */
  static async testConnection(): Promise<boolean> {
    try {
      const client = DatabaseClient.getInstance();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance for use throughout the application
export const db = DatabaseClient.getInstance();

// Export utilities
export { DatabaseClient };

// Export Prisma types for use in components/hooks
export type { Contract, Transaction, VerificationStatus, TransactionStatus, TransactionType } from '../generated/prisma';
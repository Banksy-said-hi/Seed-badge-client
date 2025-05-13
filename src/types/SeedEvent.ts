export type SeedEvent = {
  data: {
    type: string;
    timestamp: number;
    userId: string;
    [key: string]: unknown; // Allows additional optional properties
  };
  hash: string;
};

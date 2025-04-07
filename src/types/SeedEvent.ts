export type SeedEvent = {
  data: {
    type: string;
    timestamp: number;
    userId: string;
  };
  hash: string;
  // maybe add expiration date
};

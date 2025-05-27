export type SeedEvent = {
  data: {
    userId: string;
    type: string;
    timestamp: number;
    [key: string]: unknown; // Allows additional optional properties
  };
  hash: string;
};

export type SeedReward = {
  type: string;
  requiredEvents: {
    eventType: string;
    amount: number;
  }[];
  payout: bigint;
  sponsored: boolean;
  validators: string[];
};

export type SeedRewardClaim = {
  type: string;
  events: SeedEvent[];
  claimer: string;
};

export type SeedRewardClaimDisplay = {
  eventsMap: Map<string, SeedEvent[]>;
};

export type RewardClaimResult = {
  hash: string;
};

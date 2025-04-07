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

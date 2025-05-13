import { SeedEvent } from "./SeedEvent";

export type SeedRewardClaim = {
  type: string;
  events: SeedEvent[];
  claimer: string;
};

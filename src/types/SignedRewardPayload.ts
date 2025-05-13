import { RewardPayload } from "./RewardPayload";

export type SignedRewardPayload = RewardPayload & {
  signature: string;
};

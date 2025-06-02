import { Contract } from "./contract";

export class RewardContract extends Contract {
  async claimReward(messages: string[]): Promise<string> {
    return await this.send("claimReward", [messages]);
  }
}

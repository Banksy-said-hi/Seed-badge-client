import { ethers, Wallet, AbiCoder } from "ethers";

import { http, HttpResponse } from "msw";
import eventsData from "./data/events.json";
import rewardsData from "./data/rewards.json";
import {
  userRegisteredRewardContract,
  seedlingCreatedRewardContract,
} from "../contracts/erc20RewardContract";
import type { SeedRewardClaim } from "../types/index";
import type { SeedEvent } from "../types/index";

const rewardMap = {
  user_registered: userRegisteredRewardContract,
  seedling_created: seedlingCreatedRewardContract,
};

export const handlers = [
  http.get("/api/events", () => {
    return HttpResponse.json(eventsData);
  }),
  http.get("/api/rewards", () => {
    return HttpResponse.json(rewardsData);
  }),
  http.post("/api/rewards/claim", async ({ request }) => {
    const rewardClaim: SeedRewardClaim = (await request.json()) as SeedRewardClaim;

    const reward = rewardsData.find((reward) => {
      return reward.type === rewardClaim.type;
    });

    if (!reward) {
      throw new Error(`Reward type ${rewardClaim.type} not found`);
    }

    const abiCoder = AbiCoder.defaultAbiCoder();

    const sign = async (content: string) => {
      // 1. Create a signer (e.g., from a private key)
      // 0x8d06eE94eBA7856106139a27acC4E4dd5177482d - approved signer
      const signer = new Wallet(
        "0x7844566f1cdd096bcf0e34c34b72840a0202dc00850dcacd676ef4729bb37d32",
      );

      const version = 1;
      const domain = ethers.solidityPackedKeccak256(
        ["string", "uint256"],
        ["Klang Authorized Payload", version],
      );
      return await signer.signMessage(ethers.getBytes(ethers.concat([domain, content])));
    };

    const signEvent = async (event: SeedEvent) => {
      const hash = (value: string) => {
        return ethers.keccak256(ethers.toUtf8Bytes(value));
      };

      // so signature is not the same every time (isn't redeemed)
      const random = Math.floor(Math.random() * 1000000);
      event.data.timestamp = Date.now() - random;

      const content = ethers.hexlify(
        abiCoder.encode(
          ["tuple(bytes32 eventType, bytes32 userId, uint256 timestamp)"],
          [
            {
              eventType: hash(event.data.type),
              userId: hash(event.data.userId),
              timestamp: event.data.timestamp,
            },
          ],
        ),
      );

      return ethers.concat(["0x00", await sign(content), content]);
    };

    const messages = await Promise.all(
      rewardClaim.events.map(async (event) => {
        return await signEvent(event);
      }),
    );

    const hash = await rewardMap[rewardClaim.type as keyof typeof rewardMap].claimReward(messages);
    return HttpResponse.json({ hash });
  }),
];

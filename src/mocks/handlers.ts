import { ethers, Wallet, AbiCoder } from "ethers";

import { http, HttpResponse } from "msw";
import eventsData from "./data/events.json";
import rewardsData from "./data/rewards.json";
import { SeedRewardClaim } from "../types/index";
import { rewardIssuerContract } from "../contracts/rewardIssuerContract";
import { SeedEvent } from "../types/index";

export const handlers = [
  http.get("/api/events", () => {
    return HttpResponse.json(eventsData);
  }),
  http.get("/api/rewards", () => {
    return HttpResponse.json(rewardsData);
  }),
  http.post("/api/rewards/claim", async ({ request }) => {
    const rewardClaim: SeedRewardClaim =
      (await request.json()) as SeedRewardClaim;

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
        "0x7844566f1cdd096bcf0e34c34b72840a0202dc00850dcacd676ef4729bb37d32"
      );

      const version = 1;
      const domain = ethers.solidityPackedKeccak256(
        ["string", "uint256"],
        ["Klang Authorized Payload", version]
      );
      return await signer.signMessage(
        ethers.getBytes(ethers.concat([domain, content]))
      );
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
          ["tuple(bytes32 userId, bytes32 type, uint256 timestamp)"],
          [
            {
              userId: hash(event.data.userId),
              type: hash(event.data.type),
              timestamp: event.data.timestamp,
            },
          ]
        )
      );

      return ethers.concat(["0x00", await sign(content), content]);
    };

    const payload = ethers.hexlify(
      abiCoder.encode(
        ["tuple(address recipient, uint256 amount, bytes[] events)"],
        [
          {
            recipient: rewardClaim.claimer,
            amount: ethers.parseUnits(reward.payout.toString(), 18),
            // Sign each event
            events: await Promise.all(
              rewardClaim.events.map(async (event) => {
                return await signEvent(event);
              })
            ),
          },
        ]
      )
    );

    const message = ethers.concat(["0x00", await sign(payload), payload]);

    const hash = await rewardIssuerContract.verifyAndTransfer(message);
    return HttpResponse.json({ hash });
  }),
];

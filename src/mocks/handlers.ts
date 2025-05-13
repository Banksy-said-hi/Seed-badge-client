import { ethers, Wallet, AbiCoder, toUtf8Bytes } from "ethers";

import { http, HttpResponse } from "msw";
import eventsData from "./data/events.json";
import rewardsData from "./data/rewards.json";
import { SeedRewardClaim } from "../types/SeedRewardClaim";
import { rewardIssuerContract } from "../contracts/rewardIssuerContract";

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

    const reward = rewardsData.find((reward) => {
      return reward.type === rewardClaim.type;
    });

    if (!reward) {
      throw new Error(`Reward type ${rewardClaim.type} not found`);
    }

    const abiCoder = AbiCoder.defaultAbiCoder();

    const payload = ethers.hexlify(
      abiCoder.encode(
        ["tuple(address recipient, uint256 amount, bytes32 guid)"],
        [
          {
            recipient: rewardClaim.claimer,
            amount: ethers.parseUnits(reward.payout.toString(), 18),
            guid: ethers.keccak256(toUtf8Bytes(crypto.randomUUID())),
          },
        ]
      )
    );

    const signature = await signer.signMessage(
      ethers.getBytes(ethers.concat([domain, payload]))
    );

    const message = ethers.concat(["0x00", signature, payload]);

    const result = await rewardIssuerContract.verifyAndTransfer(message);
    return HttpResponse.json({ result });
  }),
];

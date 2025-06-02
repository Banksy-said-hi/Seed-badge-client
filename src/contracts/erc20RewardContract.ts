import { ethers } from "ethers";
import { RewardContract } from "./rewardContract";

class ERC20RewardContract extends RewardContract {}

const contractABI = [
  // Minimal ABI for the claimReward function
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "messages",
        type: "bytes[]",
      },
    ],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const userRegisteredRewardContract = new ERC20RewardContract(
  "0x5C59784D85bc7460EceDc766897d2533Bf1fE707",
  new ethers.Interface(contractABI),
);

export const seedlingCreatedRewardContract = new ERC20RewardContract(
  "0xbCF9E92d1D721C34C2EcA985B1Afccc92D372dF2",
  new ethers.Interface(contractABI),
);

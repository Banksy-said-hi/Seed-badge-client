import Card from "../../components/Card";
import { RewardsProvider, useRewards } from "../../context/RewardsContext";
import Loading from "../../components/Loading";
import { ClaimedRewards } from "./ClaimedRewards";
import { Events } from "./Events";
import { Modal } from "../../components/Modal";
import { chainConfig } from "../../configs/chainConfig";

function RewardsContent() {
  const {
    isLoading,
    rewards,
    claimResult,
    handleRewardSelection,
    eventsMap,
    rewardClaim,
    selectedReward,
    resetClaimResult,
  } = useRewards();

  return (
    <Card
      title="Claim Reward"
      content={
        <div className="flex flex-col items-center">
          <select
            className="mt-2 w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
            onChange={(event) => handleRewardSelection(event.target.value)}
          >
            <option className="hidden" value="" disabled>
              Select a reward
            </option>
            {rewards?.map((reward, index) => (
              <option className="bg-black" key={index} value={reward.type}>
                {reward.type}
              </option>
            ))}
          </select>
          <Card
            title="Compose Reward Claim"
            content={
              isLoading ? (
                <Loading />
              ) : (
                <>
                  {eventsMap && rewardClaim && selectedReward ? (
                    <div className="flex space-x-4">
                      <ClaimedRewards />
                      <Events />
                    </div>
                  ) : (
                    <Loading />
                  )}
                  {claimResult && (
                    <Modal title="Reward Claim Successful" onClose={() => resetClaimResult()}>
                      <p>
                        View Transaction on{" "}
                        <a
                          href={`${new URL(
                            `tx/${claimResult.hash}`,
                            chainConfig.blockExplorerUrl,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Block Explorer
                        </a>
                      </p>
                    </Modal>
                  )}
                </>
              )
            }
          />
        </div>
      }
    />
  );
}

export function RewardsContainer() {
  return (
    <RewardsProvider>
      <RewardsContent />
    </RewardsProvider>
  );
}

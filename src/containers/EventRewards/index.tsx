import { Card } from "../../components/Card";
import { EventRewardsProvider, useEventRewards } from "../../context/EventRewardsContext";
import { Loading } from "../../components/Loading";
import { RewardClaim } from "./RewardClaim";
import { Events } from "./Events";
import { Modal } from "../../components/Modal";
import { chainConfig } from "../../configs/chainConfig";
import { AllEvents } from "./AllEvents";
import { AllRewards } from "./AllRewards";

function EventRewardsContent() {
  const {
    isLoading,
    rewards,
    claimResult,
    handleRewardSelection,
    eventsMap,
    rewardClaim,
    selectedReward,
    resetClaimResult,
  } = useEventRewards();

  return (
    <>
      <Card title="Claim Reward">
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
          <Card title="Compose Reward Claim">
            {isLoading ? (
              <Loading />
            ) : eventsMap && rewardClaim && selectedReward ? (
              <div className="flex space-x-4">
                <RewardClaim />
                <Events />
              </div>
            ) : (
              <Loading />
            )}
          </Card>
        </div>
        {claimResult && (
          <Modal title="Reward Claim Successful" onClose={() => resetClaimResult()}>
            <p>
              View Transaction RewardsProvideron{" "}
              <a
                href={`${new URL(`tx/${claimResult.hash}`, chainConfig.blockExplorerUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Block Explorer
              </a>
            </p>
          </Modal>
        )}
      </Card>
      <div className="flex">
        <div className="w-1/4">
          <AllEvents />
        </div>
        <div className="w-1/2">
          <AllRewards />
        </div>
      </div>
    </>
  );
}

export function EventRewardContainer() {
  return (
    <EventRewardsProvider>
      <EventRewardsContent />
    </EventRewardsProvider>
  );
}

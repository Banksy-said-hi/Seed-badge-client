import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getEvents, claimReward } from "../api/klang";
import { getRewards } from "../api/klang";
import { SeedEvent } from "../types/SeedEvent";
import { SeedReward } from "../types/SeedReward";
import { SeedRewardClaimDisplay } from "../types/SeedRewardClaimDisplay";
import { accountPair } from "../api/web3Auth";

interface RewardsContextType {
  rewards: SeedReward[] | null;
  selectedReward: SeedReward | null;
  rewardClaim: SeedRewardClaimDisplay | null;
  eventsMap: Map<string, SeedEvent[]> | null;
  handleRewardSelection: (rewardType: string) => Promise<void>;
  validate: () => boolean;
  handleClaim: () => Promise<void>;
  addEvent: (username: string, event: SeedEvent) => void;
  removeEvent: (username: string, event: SeedEvent) => void;
}

const RewardsContext = createContext<RewardsContextType | null>(
  null
);

export function RewardsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rewards, setRewards] = useState<SeedReward[] | null>(null);
  const [selectedReward, setSelectedReward] = useState<SeedReward | null>(null);
  const [rewardClaim, setRewardClaim] = useState<SeedRewardClaimDisplay | null>(
    null
  );
  const [eventsMap, setEventsMap] = useState<Map<string, SeedEvent[]> | null>(
    null
  );

  useEffect(() => {
    const fetchRewards = async () => {
      setRewards(await getRewards());
    };
    fetchRewards();
  }, []);

  const handleRewardSelection = useCallback(
    async (rewardType: string) => {
      const currentSelectedReward = rewards?.find(
        (reward) => reward.type === rewardType
      );

      setSelectedReward(currentSelectedReward || null);

      if (!currentSelectedReward) return;

      setRewardClaim({
        eventsMap: new Map<string, SeedEvent[]>(),
      } as SeedRewardClaimDisplay);

      setEventsMap((await getEvents()) || new Map<string, SeedEvent[]>());
    },
    [rewards]
  );

  const validate = useCallback((): boolean => {
    if (!selectedReward || !rewardClaim) return false;

    for (const requiredEvent of selectedReward.requiredEvents) {
      let count = 0;

      Array.from(rewardClaim.eventsMap.entries()).forEach(([_, events]) => {
        count += events.filter(
          (e) => e.data.type === requiredEvent.eventType
        ).length;
      });

      if (count !== requiredEvent.amount) {
        return false;
      }
    }

    return true;
  }, [selectedReward, rewardClaim]);

  const handleClaim = useCallback(async () => {
    if (!selectedReward || !rewardClaim) return;

    const claimer = (await accountPair).smartAccount;
    const hash = await claimReward({
      type: selectedReward.type,
      events: Array.from(rewardClaim.eventsMap.values()).flat(),
      claimer: claimer,
    });

    console.log("Reward claimed: ", hash);
  }, [selectedReward, rewardClaim]);

  const addEvent = useCallback(
    (username: string, event: SeedEvent) => {
      if (!eventsMap || !rewardClaim) return;

      const updatedMap = new Map(eventsMap);
      updatedMap.set(
        username,
        (updatedMap.get(username) || []).filter((e) => e !== event)
      );
      setEventsMap(updatedMap);

      const updatedRewardClaim = {
        ...rewardClaim,
        eventsMap: new Map(rewardClaim.eventsMap),
      };

      if (!updatedRewardClaim.eventsMap.has(username)) {
        updatedRewardClaim.eventsMap.set(username, []);
      }

      updatedRewardClaim.eventsMap.get(username)?.push(event);
      setRewardClaim(updatedRewardClaim);
    },
    [eventsMap, rewardClaim, setEventsMap, setRewardClaim]
  );

  const removeEvent = useCallback(
    (username: string, event: SeedEvent) => {
      if (!eventsMap || !rewardClaim) return;

      const updatedMap = new Map(eventsMap);
      updatedMap.set(username, [...(updatedMap.get(username) || []), event]);
      setEventsMap(updatedMap);

      const updatedRewardClaim = {
        ...rewardClaim,
        eventsMap: new Map(rewardClaim.eventsMap),
      };

      updatedRewardClaim.eventsMap.set(
        username,
        updatedRewardClaim.eventsMap
          .get(username)
          ?.filter((e) => e !== event) || []
      );
      setRewardClaim(updatedRewardClaim);
    },
    [eventsMap, rewardClaim, setEventsMap, setRewardClaim]
  );

  const value = {
    rewards,
    selectedReward,
    rewardClaim,
    eventsMap,
    handleRewardSelection,
    validate,
    handleClaim,
    addEvent,
    removeEvent,
  };
  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error(
      "useRewards must be used within a RewardsProvider"
    );
  }
  return context;
}

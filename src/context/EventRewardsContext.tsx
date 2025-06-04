import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getEvents, claimReward, getRewards } from "../api/klang";
import type {
  SeedReward,
  SeedEvent,
  SeedRewardClaimDisplay,
  RewardClaimResult,
} from "../types/index";
import { accountPair } from "../api/web3Auth";

type EventRewardsContextType = {
  isLoading: boolean;
  rewards: SeedReward[] | null;
  selectedReward: SeedReward | null;
  rewardClaim: SeedRewardClaimDisplay | null;
  eventsMap: Map<string, SeedEvent[]> | null;
  claimResult: RewardClaimResult | null;
  handleRewardSelection: (rewardType: string) => Promise<void>;
  validate: () => boolean;
  handleClaim: () => Promise<void>;
  addEvent: (username: string, event: SeedEvent) => void;
  removeEvent: (username: string, event: SeedEvent) => void;
  resetClaimResult: () => void;
};

const EventRewardsContext = createContext<EventRewardsContextType | null>(null);

export function EventRewardsProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState<SeedReward[] | null>(null);
  const [selectedReward, setSelectedReward] = useState<SeedReward | null>(null);
  const [rewardClaim, setRewardClaim] = useState<SeedRewardClaimDisplay | null>(null);
  const [eventsMap, setEventsMap] = useState<Map<string, SeedEvent[]> | null>(null);
  const [claimResult, setClaimResult] = useState<RewardClaimResult | null>(null);

  useEffect(() => {
    const fetchRewards = async () => {
      setRewards(await getRewards());
    };
    fetchRewards();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      setEventsMap(data);
    };

    fetchEvents();
  }, []);

  const handleRewardSelection = useCallback(
    async (rewardType: string) => {
      const currentSelectedReward = rewards?.find((reward) => reward.type === rewardType);

      setSelectedReward(currentSelectedReward || null);

      if (!currentSelectedReward) return;

      setRewardClaim({
        eventsMap: new Map<string, SeedEvent[]>(),
      } as SeedRewardClaimDisplay);
    },
    [rewards],
  );

  const validate = useCallback((): boolean => {
    if (!selectedReward || !rewardClaim) return false;

    for (const requiredEvent of selectedReward.requiredEvents) {
      let count = 0;

      Array.from(rewardClaim.eventsMap.entries()).forEach(([_, events]) => {
        count += events.filter((e) => e.data.type === requiredEvent.eventType).length;
      });

      if (count !== requiredEvent.amount) {
        return false;
      }
    }

    return true;
  }, [selectedReward, rewardClaim]);

  const handleClaim = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!selectedReward || !rewardClaim) return;

      const claimer = (await accountPair).smartAccount;
      const result = await claimReward({
        type: selectedReward.type,
        events: Array.from(rewardClaim.eventsMap.values()).flat(),
        claimer: claimer,
      });

      console.log("Reward claimed: ", result.hash);

      setClaimResult(result);
    } finally {
      setIsLoading(false);
    }
  }, [selectedReward, rewardClaim]);

  const addEvent = useCallback(
    (username: string, event: SeedEvent) => {
      if (!eventsMap || !rewardClaim) return;

      const updatedMap = new Map(eventsMap);
      updatedMap.set(
        username,
        (updatedMap.get(username) || []).filter((e) => e !== event),
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
    [eventsMap, rewardClaim, setEventsMap, setRewardClaim],
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
        updatedRewardClaim.eventsMap.get(username)?.filter((e) => e !== event) || [],
      );
      setRewardClaim(updatedRewardClaim);
    },
    [eventsMap, rewardClaim, setEventsMap, setRewardClaim],
  );

  const resetClaimResult = useCallback(() => {
    setClaimResult(null);
    setRewardClaim({
      eventsMap: new Map<string, SeedEvent[]>(),
    } as SeedRewardClaimDisplay);
  }, []);

  const value = {
    isLoading,
    rewards,
    selectedReward,
    rewardClaim,
    eventsMap,
    claimResult,
    handleRewardSelection,
    validate,
    handleClaim,
    addEvent,
    removeEvent,
    resetClaimResult,
  };
  return <EventRewardsContext.Provider value={value}>{children}</EventRewardsContext.Provider>;
}

export function useEventRewards() {
  const context = useContext(EventRewardsContext);
  if (!context) {
    throw new Error("useRewards must be used within a RewardsProvider");
  }
  return context;
}

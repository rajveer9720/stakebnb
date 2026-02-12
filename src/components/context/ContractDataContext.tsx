import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { fetchContractData } from "../../utils/infuraApi";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";

interface ContractDataType {
  contractBalance: number;
  totalStaked: number;
  totalUsers: number;
  totalRefReward: number;

  checkpoint?: number;
  referrer?: string;
  directedReferralsCount?: number;
  qualifiedReferralsCount?: number;
  userDownlineCount?: number[];

  userAvailable?: number;
  userAvailableROI?: number;
  userAvailableRewards?: number;
  userReferralBonus?: number;
  userReferralTotalBonus?: number;
  userReferralWithdrawn?: number;
  userDepositBonus?: number;
  userTotalDepositBonus?: number;
  userGiveawayBonus?: number;
  userTotalGiveawayBonus?: number;

  userTotalDeposits: number;
  UserActualDividends?: number;
  userLockedROI?: number;
  userProfit: number;
  referralLink: string;

  totalROIWithdrawn?: number;
  totalRewardsWithdrawn?: number;
}

interface ContractDataContextType {
  data: ContractDataType;
  loading: boolean;
  error: string | null;
  refetchData: () => void;
}

const initialData: ContractDataType = {
  contractBalance: 0,
  totalStaked: 0,
  totalUsers: 0,
  totalRefReward: 0,
  checkpoint: 0,
  referrer: "0x0000000000000000000000000000000000000000",
  directedReferralsCount: 0,
  qualifiedReferralsCount: 0,
  userDownlineCount: [],
  userAvailable: 0,
  userAvailableROI: 0,
  userAvailableRewards: 0,
  userReferralBonus: 0,
  userReferralTotalBonus: 0,
  userReferralWithdrawn: 0,
  userDepositBonus: 0,
  userTotalDepositBonus: 0,
  userGiveawayBonus: 0,
  userTotalGiveawayBonus: 0,
  userTotalDeposits: 0,
  UserActualDividends: 0,
  userLockedROI: 0,
  userProfit: 0,
  referralLink: "",
  totalROIWithdrawn: 0,
  totalRewardsWithdrawn: 0,
};

const ContractDataContext = createContext<ContractDataContextType | undefined>(
  undefined,
);

export const ContractDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState<ContractDataType>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isSuccess: txSuccess } = useWaitForTransactionReceipt();

  const fetchContractOnlyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedData = await fetchContractData();
      setData((prev) => ({
        ...prev,
        contractBalance: fetchedData.contractBalance,
        totalStaked: fetchedData.totalStaked,
        totalUsers: fetchedData.totalUsers,
        totalRefReward: fetchedData.totalRefReward,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unknown error fetching contract data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!address) return;
    try {
      setLoading(true);
      setError(null);
      const fetchedData = await fetchContractData(address);
      setData((prev) => ({
        ...prev,
        userAvailable: fetchedData.userAvailable,
        userAvailableROI: fetchedData.userAvailableROI,
        userAvailableRewards: fetchedData.userAvailableRewards,
        userReferralBonus: fetchedData.userReferralBonus,
        userReferralTotalBonus: fetchedData.userReferralTotalBonus,
        userReferralWithdrawn: fetchedData.userReferralWithdrawn,
        qualifiedReferralsCount: fetchedData.qualifiedReferralsCount,
        userTotalDeposits: fetchedData.userTotalDeposits,
        userProfit: fetchedData.userProfit,
        referralLink: fetchedData.referralLink,
        checkpoint: fetchedData.checkpoint,
        referrer: fetchedData.referrer,
        directedReferralsCount: fetchedData.directedReferralsCount,
        UserActualDividends: fetchedData.UserActualDividends,
        userLockedROI: fetchedData.userLockedROI,
        userDepositBonus: fetchedData.userDepositBonus,
        userTotalDepositBonus: fetchedData.userTotalDepositBonus,
        userGiveawayBonus: fetchedData.userGiveawayBonus,
        userTotalGiveawayBonus: fetchedData.userTotalGiveawayBonus,
        totalROIWithdrawn: fetchedData.totalROIWithdrawn,
        totalRewardsWithdrawn: fetchedData.totalRewardsWithdrawn,
        userDownlineCount: fetchedData.userDownlineCount,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error fetching user data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [address]);

  const resetUserData = useCallback(() => {
    setData((prev) => ({
      ...prev,
      userAvailable: 0,
      userAvailableROI: 0,
      userAvailableRewards: 0,
      userReferralBonus: 0,
      userReferralTotalBonus: 0,
      qualifiedReferralsCount: 0,
      userReferralWithdrawn: 0,
      userTotalDeposits: 0,
      userProfit: 0,
      referralLink: "",
      checkpoint: 0,
      directedReferralsCount: 0,
      UserActualDividends: 0,
      userLockedROI: 0,
      userDepositBonus: 0,
      userTotalDepositBonus: 0,
      userGiveawayBonus: 0,
      userTotalGiveawayBonus: 0,
      totalROIWithdrawn: 0,
      totalRewardsWithdrawn: 0,
      userDownlineCount: [],
    }));
    setError(null);
  }, []);

  useEffect(() => {
    fetchContractOnlyData();
  }, [fetchContractOnlyData]);

  useEffect(() => {
    if (isConnected && address) {
      fetchUserData();
    } else {
      resetUserData();
    }
  }, [isConnected, address, fetchUserData, resetUserData]);


  useEffect(() => {
    if (txSuccess && isConnected && address) {
      fetchUserData();
      fetchContractOnlyData();
    }
  }, [txSuccess, isConnected, address, fetchUserData, fetchContractOnlyData]);

  const contextValue: ContractDataContextType = {
    data,
    loading,
    error,
    refetchData: () => {
      if (isConnected && address) {
        fetchUserData();
      }
      fetchContractOnlyData();
    },
  };

  return (
    <ContractDataContext.Provider value={contextValue}>
      {children}
    </ContractDataContext.Provider>
  );
};

export const useContractData = () => {
  const context = useContext(ContractDataContext);
  if (!context) {
    throw new Error(
      "useContractData must be used within a ContractDataProvider",
    );
  }
  return context;
};

import { useEffect, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { showSuccessAlert, showFailedAlert } from "./SweetAlertUtils";
import { CONTRACT_ADDRESS, ABI } from "./constants";

// ============ SHARED INTERFACES ============

interface TransactionState {
  amount: string;
  alertShown: boolean;
  processingId: string | null;
}

interface DepositState extends TransactionState {
  planId: number | null;
}

interface WithdrawState extends TransactionState {
  type: "roi" | "rewards" | "referral" | null;
}

interface UseWriteFunctionReturn<T> {
  state: T;
  setState: (state: T) => void;
  isPending: boolean;
  isLoading: boolean;
}

// ============ COMMON TRANSACTION HOOK ============

const useTransactionHandler = (transactionName: string) => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (error) {
      showFailedAlert(`${transactionName} failed`);
    }
  }, [error, transactionName]);

  return { writeContract, hash, isPending, isLoading, isSuccess };
};

// ============ VALIDATION HELPER ============

const validateTransaction = async (
  isConnected: boolean,
  chainId: number | undefined,
  expectedChainId: string,
  walletBalance: number,
  amount: string,
  minAmount: number,
  symbol?: string
): Promise<{ valid: boolean; error?: string }> => {
  if (!isConnected)
    return { valid: false, error: "Wallet not connected" };

  if (chainId && expectedChainId && chainId !== Number(expectedChainId))
    return { valid: false, error: "Wrong network" };

  const value = Number(amount);
  if (!value || value < minAmount)
    return { valid: false, error: `Min ${minAmount} ${symbol || ""}`.trim() };

  if (value > walletBalance)
    return { valid: false, error: "Insufficient balance" };

  return { valid: true };
};

// ============ DEPOSIT HOOK ============

interface UseDepositReturn extends UseWriteFunctionReturn<DepositState> {
  handleDeposit: (
    planId: number,
    walletBalance: number,
    minDeposit: number,
    symbol: string,
    isConnected: boolean,
    getReferrer?: () => string,
    getCurrentChainId?: () => Promise<number>,
    expectedChainId?: string,
    openConnectModal?: () => void
  ) => Promise<void>;
}

export const useDeposit = (refetchData: () => void): UseDepositReturn => {
  const [deposit, setDeposit] = useState<DepositState>({
    planId: null,
    amount: "",
    alertShown: false,
    processingId: null,
  });

  const { writeContract, isPending, isLoading, isSuccess } =
    useTransactionHandler("Investment");

  useEffect(() => {
    if (isSuccess && !deposit.alertShown) {
      refetchData();
      showSuccessAlert(
        `Investment successful<br/>
         <a target="_blank" href="${import.meta.env.VITE_APP_REFERRAL_LINK_WITHDRAW_URL}">
         View Transaction</a>`
      );
      setDeposit((prev) => ({
        ...prev,
        alertShown: true,
        processingId: null,
      }));
    }
  }, [isSuccess, deposit.alertShown, refetchData]);

  const handleDeposit = async (
    planId: number,
    walletBalance: number,
    minDeposit: number,
    symbol: string,
    isConnected: boolean,
    getReferrer?: () => string,
    getCurrentChainId?: () => Promise<number>,
    expectedChainId?: string,
    openConnectModal?: () => void
  ): Promise<void> => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    const chain = await getCurrentChainId?.();
    const validation = await validateTransaction(
      isConnected,
      chain,
      expectedChainId || "",
      walletBalance,
      deposit.amount,
      minDeposit,
      symbol
    );

    if (!validation.valid) {
      showFailedAlert(validation.error || "Validation failed");
      return;
    }

    setDeposit((prev) => ({
      ...prev,
      alertShown: false,
      processingId: `plan-${planId}`,
    }));

    const referrer = getReferrer?.();

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "invest",
        args: [referrer, planId],
        value: parseEther(deposit.amount),
      });
    } catch (err) {
      console.error("Investment error:", err);
      showFailedAlert("Failed to process investment");
      setDeposit((prev) => ({ ...prev, processingId: null }));
    }
  };

  return {
    state: deposit,
    setState: setDeposit,
    handleDeposit,
    isPending,
    isLoading,
  };
};

// ============ WITHDRAW HOOK ============

interface UseWithdrawReturn extends UseWriteFunctionReturn<WithdrawState> {
  handleWithdraw: (
    withdrawType: "roi" | "rewards" | "referral",
    isConnected: boolean,
    getCurrentChainId?: () => Promise<number>,
    expectedChainId?: string,
    openConnectModal?: () => void
  ) => Promise<void>;
}

export const useWithdraw = (refetchData: () => void): UseWithdrawReturn => {
  const [withdraw, setWithdraw] = useState<WithdrawState>({
    type: null,
    amount: "",
    alertShown: false,
    processingId: null,
  });

  const { writeContract, isPending, isLoading, isSuccess } =
    useTransactionHandler("Withdrawal");

  useEffect(() => {
    if (isSuccess && !withdraw.alertShown) {
      refetchData();
      showSuccessAlert(
        `Withdrawal successful<br/>
         <a target="_blank" href="${import.meta.env.VITE_APP_REFERRAL_LINK_WITHDRAW_URL}">
         View Transaction</a>`
      );
      setWithdraw((prev) => ({
        ...prev,
        alertShown: true,
        processingId: null,
      }));
    }
  }, [isSuccess, withdraw.alertShown, refetchData]);

  const handleWithdraw = async (
    withdrawType: "roi" | "rewards" | "referral",
    isConnected: boolean,
    getCurrentChainId?: () => Promise<number>,
    expectedChainId?: string,
    openConnectModal?: () => void
  ): Promise<void> => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    const chain = await getCurrentChainId?.();
    if (chain && expectedChainId && chain !== Number(expectedChainId)) {
      showFailedAlert("Wrong network");
      return;
    }

    setWithdraw((prev) => ({
      ...prev,
      alertShown: false,
      processingId: `${withdrawType}-withdraw`,
      type: withdrawType,
    }));

    const functionNameMap = {
      roi: "withdrawDividends",
      rewards: "withdrawRewards",
      referral: "withdrawReferralBonus",
    };

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: functionNameMap[withdrawType],
        args: [],
      });
    } catch (err) {
      console.error("Withdrawal error:", err);
      showFailedAlert("Failed to process withdrawal");
      setWithdraw((prev) => ({ ...prev, processingId: null }));
    }
  };

  return {
    state: withdraw,
    setState: setWithdraw,
    handleWithdraw,
    isPending,
    isLoading,
  };
};

// ============ CLAIM REWARDS HOOK ============

interface UseClaimRewardsReturn extends UseWriteFunctionReturn<TransactionState> {
  handleClaim: (
    isConnected: boolean,
    getCurrentChainId?: () => Promise<number>,
    expectedChainId?: string,
    openConnectModal?: () => void
  ) => Promise<void>;
}

export const useClaimRewards = (
  refetchData: () => void
): UseClaimRewardsReturn => {
  const [claim, setClaim] = useState<TransactionState>({
    amount: "",
    alertShown: false,
    processingId: null,
  });

  const { writeContract, isPending, isLoading, isSuccess } =
    useTransactionHandler(refetchData, "Rewards Claim");

  useEffect(() => {
    if (isSuccess) {
      setClaim((prev) => ({
        ...prev,
        alertShown: true,
        processingId: null,
      }));
    }
  }, [isSuccess]);

  const handleClaim = async (
    isConnected: boolean,
    getCurrentChainId?: () => Promise<number>,
    expectedChainId?: string,
    openConnectModal?: () => void
  ): Promise<void> => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    const chain = await getCurrentChainId?.();
    if (chain && expectedChainId && chain !== Number(expectedChainId)) {
      showFailedAlert("Wrong network");
      return;
    }

    setClaim((prev) => ({
      ...prev,
      alertShown: false,
      processingId: "claim-rewards",
    }));

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "claimRewards",
        args: [],
      });
    } catch (err) {
      console.error("Claim error:", err);
      showFailedAlert("Failed to claim rewards");
      setClaim((prev) => ({ ...prev, processingId: null }));
    }
  };

  return {
    state: claim,
    setState: setClaim,
    handleClaim,
    isPending,
    isLoading,
  };
};

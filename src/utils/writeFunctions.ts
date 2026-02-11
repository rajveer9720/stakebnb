import { useEffect, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { showSuccessAlert, showFailedAlert } from "./SweetAlertUtils";
import { CONTRACT_ADDRESS, ABI } from "./constants";

interface TxState {
  amount: string;
  alertShown: boolean;
  processingId: string | null;
}

interface DepositState extends TxState {
  planId: number | null;
}

const useTx = (name: string, onSuccess?: () => void) => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  useEffect(() => {
    if (error) showFailedAlert(`${name} failed`);
  }, [error, name]);
  useEffect(() => {
    if (isSuccess) onSuccess?.();
  }, [isSuccess]);
  return { writeContract, isPending, isLoading };
};

const validate = async (
  isConnected: boolean,
  chainId: number | undefined,
  expectedChainId: string | undefined,
  walletBalance: number,
  amount: string,
  minAmount: number,
  symbol?: string
) => {
  if (!isConnected) return { valid: false, error: "Wallet not connected" };
  if (chainId && expectedChainId && chainId !== Number(expectedChainId))
    return { valid: false, error: "Wrong network" };
  const value = Number(amount);
  if (!value || value < minAmount)
    return { valid: false, error: `Min ${minAmount} ${symbol || ""}`.trim() };
  if (value > walletBalance) return { valid: false, error: "Insufficient balance" };
  return { valid: true };
};

export const useInvest = (refetch: () => void) => {
  const [state, setState] = useState<DepositState>({ planId: null, amount: "", alertShown: false, processingId: null });
  const onSuccess = () => {
    if (!state.alertShown) {
      refetch();
      showSuccessAlert(`Investment successful<br/><a target="_blank" href="${import.meta.env.VITE_APP_REFERRAL_LINK_WITHDRAW_URL}">View Transaction</a>`);
      setState((s) => ({ ...s, alertShown: true, processingId: null }));
    }
  };
  const { writeContract, isPending, isLoading } = useTx("Investment", onSuccess);
  const invest = async (
    planId: number,
    walletBalance: number,
    minDeposit: number,
    symbol: string,
    isConnected: boolean,
    getReferrer?: () => string,
    getCurrentChainId?: () => Promise<number>,
    expectedChainId?: string,
    openConnectModal?: () => void
  ) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    const chain = await getCurrentChainId?.();
    const v = await validate(isConnected, chain, expectedChainId, walletBalance, state.amount, minDeposit, symbol);
    if (!v.valid) {
      showFailedAlert(v.error || "Validation failed");
      return;
    }
    setState((s) => ({ ...s, alertShown: false, processingId: `plan-${planId}` }));
    const referrer = getReferrer?.();
    const amountInWei = parseEther(state.amount);
    try {
      writeContract({ 
        address: CONTRACT_ADDRESS, 
        abi: ABI, 
        functionName: "invest", 
        args: [referrer, planId], 
        value: amountInWei 
      });
    } catch (e) {
      showFailedAlert("Failed to process investment");
      setState((s) => ({ ...s, processingId: null }));
    }
  };
  return { state, setState, invest, isPending, isLoading };
};

const useWithdrawBase = (name: string, fnName: string, refetch?: () => void) => {
  const [state, setState] = useState<TxState>({ amount: "", alertShown: false, processingId: null });
  const onSuccess = () => {
    if (!state.alertShown) {
      refetch?.();
      showSuccessAlert(`Withdrawal successful<br/><a target="_blank" href="${import.meta.env.VITE_APP_REFERRAL_LINK_WITHDRAW_URL}">View Transaction</a>`);
      setState((s) => ({ ...s, alertShown: true, processingId: null }));
    }
  };
  const { writeContract, isPending, isLoading } = useTx(name, onSuccess);
  const withdraw = async (
    isConnected: boolean,
    getCurrentChainId?: () => Promise<number>,
    expectedChainId?: string,
    openConnectModal?: () => void
  ) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    const chain = await getCurrentChainId?.();
    if (chain && expectedChainId && chain !== Number(expectedChainId)) {
      showFailedAlert("Wrong network");
      return;
    }
    setState((s) => ({ ...s, alertShown: false, processingId: `${fnName}-withdraw` }));
    try {
      writeContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: fnName, args: [] });
    } catch (e) {
      showFailedAlert("Failed to process withdrawal");
      setState((s) => ({ ...s, processingId: null }));
    }
  };
  return { state, setState, withdraw, isPending, isLoading };
};

export const useWithdrawRoi = (refetch?: () => void) => useWithdrawBase("Withdraw ROI", "withdrawDividends", refetch);

export const useWithdrawRewards = (refetch?: () => void) => useWithdrawBase("Withdraw Rewards", "withdrawRewards", refetch);
import { useState, useEffect } from "react";
import { useContractData } from "../context/ContractDataContext";
import {
  useAccount,
  useBalance,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { getWalletChainId, getWalletSymbol } from "../../utils/ProviderUtils";
import { showSuccessAlert, showFailedAlert } from "../../utils/SweetAlertUtils";
import { parseEther } from "viem";
import abi from "../../utils/abi.json";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { applyTheme } from "../../utils/colorUtils";
import "./Deposit.css";

const EXPECTED_CHAIN_ID = getWalletChainId().toString();
const CONTRACT_ADDRESS = import.meta.env.VITE_APP_INFURA_CONTRACT_ADDRESS;

interface Plan {
  id: number;
  name: string;
  dailyEarnings: number;
  totalROI: number;
  duration: number;
  givewayBonus?: number;
}

const Packages = () => {
  const { refetchData } = useContractData();
  const { address, isConnected } = useAccount();
  const { data: balance, refetch } = useBalance({ address });
  const { openConnectModal } = useConnectModal();
  const chainId = useChainId();
  const symbol = getWalletSymbol();

  const minDeposit = Number(import.meta.env.VITE_APP_DEPOSIT_MIN_DEPOSIT || 0);

  const [amountsByPlan, setAmountsByPlan] = useState<Record<number, string>>({});
  const [alertShown, setAlertShown] = useState(false);

  const walletBalance = balance ? Number(balance.formatted) : 0;

  const plans: Plan[] = [
    {
      id: 0,
      name: "SAVINGS",
      dailyEarnings: 12.6,
      totalROI: 151.2,
      duration: 12,
    },
    {
      id: 1,
      name: "CLASSICS",
      dailyEarnings: 10.5,
      totalROI: 189.0,
      duration: 18,
    },
    {
      id: 2,
      name: "PREMIUM",
      dailyEarnings: 9.7,
      totalROI: 242.5,
      duration: 25,
    },
    {
      id: 3,
      name: "SILVER",
      dailyEarnings: 13.3,
      totalROI: 159.6,
      duration: 12,
      givewayBonus: 1,
    },
    {
      id: 4,
      name: "GOLD",
      dailyEarnings: 11.6,
      totalROI: 208.8,
      duration: 18,
      givewayBonus: 2,
    },
    {
      id: 5,
      name: "PLATINUM",
      dailyEarnings: 11.3,
      totalROI: 282.5,
      duration: 25,
      givewayBonus: 3,
    },
  ];

  const getCurrentChainId = async () => {
    if (!window.ethereum) return chainId;
    const id = await window.ethereum.request({ method: "eth_chainId" });
    return parseInt(id, 16);
  };

  const getReferrer = () => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    return ref && ref.startsWith("0x") && ref.length === 42
      ? ref
      : import.meta.env.VITE_APP_PROJECT_ADDRESS;
  };

  const calculateROI = (amountStr: string, planId: number) => {
    const amt = Number(amountStr || 0);
    const plan = plans[planId];
    const roi = (amt * plan.totalROI) / 100;
    return roi.toFixed(2);
  };

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    const i = setInterval(refetch, 1000);
    return () => clearInterval(i);
  }, [refetch]);

  useEffect(() => {
    if (error) showFailedAlert("Transaction failed");
  }, [error]);

  useEffect(() => {
    if (isSuccess && hash && !alertShown) {
      refetchData();
      showSuccessAlert(
        `Investment successful<br/>
         <a target="_blank" href="${import.meta.env.VITE_APP_REFERRAL_LINK_WITHDRAW_URL}${hash}">
         View Transaction</a>`
      );
      setAlertShown(true);
    }
  }, [isSuccess, hash, alertShown, refetchData]);

  const handleDeposit = async (planId: number) => {
    if (!isConnected) return openConnectModal?.();

    const chain = await getCurrentChainId();
    if (chain !== Number(EXPECTED_CHAIN_ID))
      return showFailedAlert("Wrong network");

    const amount = amountsByPlan[planId];
    const value = Number(amount);

    if (!value || value < minDeposit)
      return showFailedAlert(`Min ${minDeposit} ${symbol}`);

    if (value > walletBalance)
      return showFailedAlert("Insufficient balance");

    setAlertShown(false);

    const referrer = getReferrer();
    const args = [referrer, planId];

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "invest",
        args,
        value: parseEther(amount),
      });
    } catch (err) {
      console.error("Investment error:", err);
      showFailedAlert("Failed to process investment");
    }
  };

  useEffect(() => {
    applyTheme();
  }, []);

  return (
    <div className="packages-section">
      <div className="packages-container">
        <div className="packages-header">
          <h1 className="packages-title">PACKAGES</h1>
        </div>

        <div className="packages-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="package-card">
              <div
                className="package-card-inner"
              >
                {/* Header */}
                <div className="package-header">
                  <h3 className="package-name">{plan.name}</h3>
                  <div className="package-lock-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>

                {/* Earnings Section */}
                <div className="package-earnings">
                  <div className="earnings-item">
                    <span className="earnings-label">Daily Earnings</span>
                    <span className="earnings-value">{plan.dailyEarnings} %</span>
                  </div>
                  <div className="earnings-item">
                    <span className="earnings-label">Total ROI</span>
                    <span className="earnings-value">{plan.totalROI} %</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="package-duration">
                  <span className="duration-number">{plan.duration}</span>
                  <span className="duration-label">DAYS</span>
                </div>

                {/* Input Section */}
                <div className="package-input-section">
                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">Enter Amount {symbol}</label>
                      <input
                        type="number"
                        className="package-input"
                        placeholder="0"
                        value={amountsByPlan[plan.id] || ""}
                        onChange={(e) =>
                          setAmountsByPlan((s) => ({ ...s, [plan.id]: e.target.value }))
                        }
                      />
                    </div>
                    <div className="roi-group">
                      <label className="roi-label">
                        ROI in {plan.duration} Days
                      </label>
                      <span className="roi-value">
                        {calculateROI(amountsByPlan[plan.id] || "0", plan.id)}
                      </span>
                    </div>
                  </div>

                  {/* Giveway Bonus Checkbox */}
                  {plan.givewayBonus && (
                    <div className="giveway-bonus">
                      <label className="checkbox-container">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span className="checkbox-label">
                          {plan.givewayBonus}% Giveway Bonus Instant Credit
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Deposit Button */}
                  <button
                    className="deposit-button"
                    disabled={isPending || isLoading}
                    onClick={() => handleDeposit(plan.id)}
                  >
                    {isPending || isLoading ? "PROCESSING..." : "DEPOSIT"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packages;
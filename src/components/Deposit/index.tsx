import { useEffect } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { useContractData } from "../context/ContractDataContext";
import { getWalletChainId, getWalletSymbol } from "../../utils/ProviderUtils";
import { useInvest } from "../../utils/writeFunctions";
import { applyTheme } from "../../utils/colorUtils";

import "./Deposit.css";

const EXPECTED_CHAIN_ID = getWalletChainId().toString();
const MIN_DEPOSIT = Number(import.meta.env.VITE_APP_DEPOSIT_MIN_DEPOSIT || 0);
const FALLBACK_REFERRER = import.meta.env.VITE_APP_PROJECT_ADDRESS;

interface Plan {
  id: number;
  name: string;
  dailyEarnings: number;
  totalROI: number;
  duration: number;
  giveawayBonus?: number;
}

const PLANS: Plan[] = [
  { id: 0, name: "SAVINGS", dailyEarnings: 9.3, totalROI: 111.6, duration: 12 },
  { id: 1, name: "CLASSICS", dailyEarnings: 7.2, totalROI: 129.6, duration: 18 },
  { id: 2, name: "PREMIUM", dailyEarnings: 6.4, totalROI: 160, duration: 25 },
  { id: 3, name: "SILVER", dailyEarnings: 10, totalROI: 213.84, duration: 12, giveawayBonus: 1 },
  { id: 4, name: "GOLD", dailyEarnings: 8.3, totalROI: 325.08, duration: 18, giveawayBonus: 2 },
  { id: 5, name: "PLATINUM", dailyEarnings: 8, totalROI: 584.65, duration: 25, giveawayBonus: 3 },
];


const Packages = () => {
  const { refetchData } = useContractData();
  const { address, isConnected } = useAccount();
  const { data: balance, refetch } = useBalance({ address });
  const { openConnectModal } = useConnectModal();
  const chainId = useChainId();

  const symbol = getWalletSymbol();
  const walletBalance = Number(balance?.formatted || 0);

  const { state: deposit, setState: setDeposit, invest, isPending, isLoading } =
    useInvest(refetchData);

  const getCurrentChainId = async () => {
    if (!window.ethereum) return chainId;
    const id = await window.ethereum.request({ method: "eth_chainId" });
    return parseInt(id, 16);
  };

  const getReferrer = () => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    return ref?.startsWith("0x") && ref.length === 42 ? ref : FALLBACK_REFERRER;
  };

  const calculateROI = (amount: string, plan: Plan) =>
    ((Number(amount || 0) * plan.totalROI) / 100).toFixed(2);

  useEffect(() => {
    const interval = setInterval(refetch, 1000);
    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    applyTheme();
  }, []);

  return (
    <div className="packages-section" id="deposit">
      <div className="packages-container">
        <div className="packages-header">
          <h1 className="packages-title">PACKAGES</h1>
        </div>

        <div className="packages-grid">
          {PLANS.map((plan) => {
            const isActive = deposit.planId === plan.id;
            const isProcessing =
              deposit.processingId === `plan-${plan.id}` && (isPending || isLoading);

            return (
              <div key={plan.id} className="package-card">
                <div className="package-card-inner">
                  <div className="package-header">
                    <h3 className="package-name">{plan.name}</h3>
                    <div className="package-lock-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </div>

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

                  <div className="package-duration">
                    <span className="duration-number">{plan.duration}</span>
                    <span className="duration-label">DAYS</span>
                  </div>

                  <div className="package-input-section">
                    <div className="input-row">
                      <div className="input-group">
                        <label className="input-label">Enter Amount {symbol}</label>
                        <input
                          type="number"
                          className="package-input"
                          placeholder="0"
                          value={isActive ? deposit.amount : ""}
                          onChange={(e) =>
                            setDeposit({ ...deposit, planId: plan.id, amount: e.target.value })
                          }
                        />
                      </div>

                      <div className="roi-group">
                        <label className="roi-label">ROI in {plan.duration} Days</label>
                        <span className="roi-value">
                          {calculateROI(isActive ? deposit.amount : "0", plan)} <span className="symbol">{symbol}</span> 
                        </span>
                      </div>
                    </div>

                    {plan.giveawayBonus && (
                      <div className="giveaway-bonus">
                        <label className="checkbox-container">
                      ℹ️  
                          <span className="checkbox-label">
                            {plan.giveawayBonus}% Giveaway Bonus Instant Credit
                          </span>
                        </label>
                      </div>
                    )}

                    <button
                      className="deposit-button"
                      disabled={isProcessing}
                      onClick={() =>
                        invest(
                          plan.id,
                          walletBalance,
                          MIN_DEPOSIT,
                          symbol,
                          isConnected,
                          getReferrer,
                          getCurrentChainId,
                          EXPECTED_CHAIN_ID,
                          openConnectModal
                        )
                      }
                    >
                      {isProcessing ? "PROCESSING..." : "DEPOSIT"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Packages;

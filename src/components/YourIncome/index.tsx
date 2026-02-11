import { useState, useEffect } from "react";
import { showSuccessAlert, showFailedAlert } from "../../utils/SweetAlertUtils";
import { useContractData } from "../context/ContractDataContext";
import { getWalletChainId, getWalletSymbol } from "../../utils/ProviderUtils";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import abi from "../../utils/abi.json";
import "./yourincome.css";

const ReferralLinkData = () => {
  const { openConnectModal } = useConnectModal();
  const symbol = getWalletSymbol();
  const { data, refetchData } = useContractData();
  const { isConnected } = useAccount();
  const [toastShown, setToastShown] = useState(false);

  const TransactionURL =
    import.meta.env.VITE_APP_REFERRAL_LINK_WITHDRAW_URL || "";
  const contractAddress = import.meta.env.VITE_APP_INFURA_CONTRACT_ADDRESS;

  const EXPECTED_CHAIN_ID = getWalletChainId().toString();
  const chainId = useChainId();

  const getCurrentChainId = async (): Promise<number> => {
    if (window.ethereum) {
      try {
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        return parseInt(currentChainId, 16);
      } catch (error) {
        console.error("Error fetching chain ID:", error);
        return chainId;
      }
    }
    return chainId;
  };

  const {
    writeContract,
    data: hash,
    error: withdrawError,
  } = useWriteContract();
  
  const successLink = `${TransactionURL}${hash}`;

  const { isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isTransactionSuccess && hash && !toastShown) {
      refetchData();
      showSuccessAlert(
        `Your withdrawal has been processed successfully. 
    <br>To view the transaction <a href=${successLink} target="_blank">click here</a>.`
      );
      setToastShown(true);
    }
  }, [isTransactionSuccess, hash, refetchData, toastShown, successLink]);

  useEffect(() => {
    if (!isTransactionSuccess) setToastShown(false);
  }, [isTransactionSuccess]);

  const handleWithdraw = async () => {
    try {
      if (!isConnected) {
        openConnectModal?.();
        return;
      }
      if ((data?.userAvailableROI ?? 0) === 0) {
        showFailedAlert("No funds available for withdrawal.");
        return;
      }
      const currentChainId = await getCurrentChainId();
      if (currentChainId !== parseInt(EXPECTED_CHAIN_ID)) {
        showFailedAlert("Wrong network active.");
        return;
      }
      if ((data?.userAvailableROI ?? 0) > data?.contractBalance) {
        showFailedAlert("Contract balance is low");
        return;
      }
      await writeContract({
        address: contractAddress,
        abi: abi,
        functionName: "withdrawROI",
      });
    } catch (error) {
      console.error("Withdraw error:", error);
    }
  };

  useEffect(() => {
    if (withdrawError) {
      showFailedAlert("Something went wrong. Please try again.");
    }
  }, [withdrawError]);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">User Dashboard</h1>
            <div className="live-status">
              <span className="pulse-dot"></span>
              <span className="status-text">Live Statistics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="main-grid">
        {/* Hero Card - Available Balance */}
        <div className="hero-card">
          <div className="hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>
          
          <div className="hero-content">
            <div className="hero-header">
              <div className="hero-icon">💰</div>
              <div className="hero-label">Available to Withdraw</div>
            </div>
            
            <div className="hero-amount">
              <span className="amount-value">
                {(data?.userAvailableROI ?? 0).toFixed(4)}
              </span>
              <span className="amount-symbol">{symbol}</span>
            </div>

            <div className="hero-stats-row">
              <div className="mini-stat-item">
                <div className="mini-stat-label">Total Earned</div>
                <div className="mini-stat-value">
                  {(data?.userDividends ?? 0).toFixed(4)} {symbol}
                </div>
              </div>
              <div className="mini-stat-item">
                <div className="mini-stat-label">Total Withdrawn</div>
                <div className="mini-stat-value">
                  {(data?.totalROIWithdrawn ?? 0).toFixed(4)} {symbol}
                </div>
              </div>
            </div>

            <button
              className="hero-withdraw-btn"
              onClick={handleWithdraw}
              disabled={(data?.userAvailableROI ?? 0) === 0}
            >
              <span className="btn-icon">⚡</span>
              <span className="btn-text">Withdraw Roi Dividends</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-section">
          <div className="section-title">Account Overview</div>
          
          <div className="stats-cards-grid">
            <div className="stat-card card-green">
              <div className="stat-card-icon">💎</div>
              <div className="stat-card-content">
                <div className="stat-card-label">Total Deposits</div>
                <div className="stat-card-value">
                  {(data?.userTotalDeposits ?? 0).toFixed(4)} {symbol}
                </div>
              </div>
              <div className="stat-card-decoration"></div>
            </div>

            <div className="stat-card card-orange">
              <div className="stat-card-icon">💵</div>
              <div className="stat-card-content">
                <div className="stat-card-label">User Profit</div>
                <div className="stat-card-value">
                  {(data?.userProfit ?? 0).toFixed(2)} %
                </div>
              </div>
              <div className="stat-card-decoration"></div>  
            </div>

            <div className="stat-card card-pink">
              <div className="stat-card-icon">🎁</div>
              <div className="stat-card-content">
                <div className="stat-card-label">Total Giveaway Bonus</div>
                <div className="stat-card-value">
                  {(data?.userTotalGiveawayBonus ?? 0).toFixed(4)} {symbol}
                </div>
              </div>
              <div className="stat-card-decoration"></div>
            </div>
             <div className="stat-card card-pink">
              <div className="stat-card-icon">💰</div>
              <div className="stat-card-content">
                <div className="stat-card-label">Total Deposit Bonus</div>
                <div className="stat-card-value">
                  {(data?.userTotalDepositBonus ?? 0).toFixed(4)} {symbol}
                </div>
              </div>
              <div className="stat-card-decoration"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralLinkData;
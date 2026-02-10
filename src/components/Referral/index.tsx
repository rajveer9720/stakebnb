import React, { useState, useEffect } from "react";
import { useContractData } from "../context/ContractDataContext";
import { getWalletSymbol, getWalletChainId } from "../../utils/ProviderUtils";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { showSuccessAlert, showFailedAlert } from "../../utils/SweetAlertUtils";
import abi from "../../utils/abi.json";
import "./Referral.css";

const Referral: React.FC = () => {
  const { data, refetchData } = useContractData();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const symbol = getWalletSymbol();
  const projectAddress = import.meta.env.VITE_APP_PROJECT_ADDRESS || "";
  const adminAddress = import.meta.env.VITE_APP_ADMIN_ADDRESS || "";
  const refSwitch = import.meta.env.VITE_APP_REF_SWITCH_BUTTON || "true";

  const referralLink = `${window.location.origin}/?ref=${address}`;
  const [copied, setCopied] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  const TransactionURL = import.meta.env.VITE_APP_REFERRAL_LINK_WITHDRAW_URL || "";
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
        return chainId as number;
      }
    }
    return chainId as number;
  };

  const {
    writeContract: writeContractReferral,
    data: hashReferral,
    error: withdrawReferralError,
  } = useWriteContract();

  const { isSuccess: isReferralTransactionSuccess } = useWaitForTransactionReceipt({
    hash: hashReferral,
  });

  useEffect(() => {
    if (isReferralTransactionSuccess && hashReferral && !toastShown) {
      refetchData();
      const successLinkReferral = `${TransactionURL}${hashReferral}`;
      showSuccessAlert(
        `Your referral withdrawal has been processed successfully. \n    <br>To view the transaction <a href=${successLinkReferral} target="_blank">click here</a>.`
      );
      setToastShown(true);
    }
  }, [isReferralTransactionSuccess, hashReferral, refetchData, toastShown]);

  useEffect(() => {
    if (withdrawReferralError) {
      showFailedAlert(
        "Something went wrong with referral withdrawal. Please try again."
      );
    }
  }, [withdrawReferralError]);

  const canShowLink =
    refSwitch === "true" &&
    address &&
    (address === projectAddress ||
      address === adminAddress ||
      (data?.userTotalDeposits ?? 0) > 0);

  const handleCopyClick = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    if (refSwitch !== "true") {
      showFailedAlert("Referral feature is disabled");
      return;
    }
    if (!address) {
      showFailedAlert("Wallet not connected!");
      return;
    }
    if (!canShowLink) {
      showFailedAlert("You will get your ref link after investing");
      return;
    }
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
      showSuccessAlert("Referral link copied!");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
      showSuccessAlert("Referral link copied!");
    }
  };
  
  const handleWithdrawReferral = async () => {
    try {
      if (!isConnected) {
        openConnectModal?.();
        return;
      }
      if ((data?.userReferralBonus ?? 0) === 0) {
        showFailedAlert("No referral bonus available for withdrawal.");
        return;
      }
      const currentChainId = await getCurrentChainId();
      if (currentChainId !== parseInt(EXPECTED_CHAIN_ID)) {
        showFailedAlert("Wrong network active.");
        return;
      }
      await writeContractReferral({
        address: contractAddress,
        abi: abi,
        functionName: "withdrawRewards",
      });
    } catch (error) {
      console.error("Withdraw referral error:", error);
    }
  };
  

  return (
    <section className="referral-section">
      <div className="referral-container">
        <div className="referral-header">
          <h2 className="referral-title">Referral Program</h2>
          <p className="referral-subtitle">
            Invite your friends and earn rewards. Share your unique referral link to start earning.
          </p>
        </div>

        <div className="link-box-wrapper">
          <div className="referral-link-box">
            <span className="link-icon">🔗</span>
            <span className="link-text">
              {canShowLink
                ? referralLink
                : refSwitch !== "true"
                ? "Referral feature is disabled"
                : "Invest to unlock your referral link"}
            </span>
          </div>
          
          <button
            className={`copy-btn ${copied ? "copied" : ""}`}
            onClick={handleCopyClick}
          >
            {copied ? (
              <>
                <span>✓</span> Copied
              </>
            ) : (
              <>
                <span>📋</span> Copy Link
              </>
            )}
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper">💰</div>
            <div className="stat-content">
              <h4 >Referral Bonus Earned</h4>
              <p className="stat-value" >
                {(data?.userReferralTotalBonus ?? 0).toFixed(4) || "0.000"}
                <span className="stat-symbol">{symbol}</span>
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">👥</div>
            <div className="stat-content">
              <h4 >Total Referrals</h4>
              <p className="stat-value">
                {data?.directedReferralsCount ?? 0}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">🎁</div>
            <div className="stat-content">
              <h4 >Referrals Bonus Available </h4>
              <p className="stat-value">
                {data?.userReferralBonus ?? 0}
              </p>
            </div>
          </div>
        </div>
        <div style={{ 
          display: "flex", 
          justifyContent: window.innerWidth <= 600 ? "stretch" : "center",
          width: "100%"
        }}>
        <button
          className="premium-withdraw-btn"
          onClick={handleWithdrawReferral}
          style={{
            border: "none",
            borderRadius: "12px",
            padding: "12px 24px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            cursor: "pointer",
            width: window.innerWidth <= 600 ? "100%" : "25%",
            minWidth: window.innerWidth > 600 ? "300px" : "auto",
            maxWidth: window.innerWidth <= 600 ? "100%" : "25%"
          }}
        >
          Withdraw Referral
        </button>
          </div>
      </div>
    </section>
  );
};

export default Referral;

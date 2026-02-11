import React, { useState } from "react";
import { useContractData } from "../context/ContractDataContext";
import { getWalletSymbol, getWalletChainId } from "../../utils/ProviderUtils";
import { useAccount, useChainId } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { showSuccessAlert, showFailedAlert } from "../../utils/SweetAlertUtils";
import { useWithdrawRewards } from "../../utils/writeFunctions";
import "./Referral.css";

const Referral: React.FC = () => {
  const { data, refetchData } = useContractData();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const symbol = getWalletSymbol();
  const chainId = useChainId();
  const projectAddress = import.meta.env.VITE_APP_PROJECT_ADDRESS || "";
  const adminAddress = import.meta.env.VITE_APP_ADMIN_ADDRESS || "";
  const  refSwitch = import.meta.env.VITE_APP_REF_SWITCH_BUTTON || "true";
  const EXPECTED_CHAIN_ID = getWalletChainId().toString();

  const { withdraw, isPending, isLoading } = useWithdrawRewards(refetchData);

  const referralLink = `${window.location.origin}/?ref=${address}`;
  const [copied, setCopied] = useState(false);

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

        <button
          className="withdraw-referral-btn"
          onClick={() => withdraw(isConnected, getCurrentChainId, EXPECTED_CHAIN_ID, openConnectModal)}
          disabled={isPending || isLoading || (data?.userReferralBonus ?? 0) === 0}
        >
          {isPending || isLoading ? "Processing..." : "Withdraw Rewards"}
        </button>

      </div>
    </section>
  );
};

export default Referral;

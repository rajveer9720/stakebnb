import React, { useState } from "react";
import { useContractData } from "../context/ContractDataContext";
import { getWalletSymbol } from "../../utils/ProviderUtils";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { showSuccessAlert, showFailedAlert } from "../../utils/SweetAlertUtils";
import "./Referral.css";

const Referral: React.FC = () => {
  const { data } = useContractData();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const symbol = getWalletSymbol();
  const projectAddress = import.meta.env.VITE_APP_PROJECT_ADDRESS || "";
  const adminAddress = import.meta.env.VITE_APP_ADMIN_ADDRESS || "";
  const refSwitch = import.meta.env.VITE_APP_REF_SWITCH_BUTTON || "true";

  const referralLink = `${window.location.origin}/?ref=${address}`;
  const [copied, setCopied] = useState(false);

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

      </div>
    </section>
  );
};

export default Referral;

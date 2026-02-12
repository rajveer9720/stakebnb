import React from "react";
import { getWalletSymbol } from "../../utils/ProviderUtils";
import "./InvestmentInfo.css";

const InvestmentInfo: React.FC = () => {
  const symbol = getWalletSymbol();

  const investmentParams = {
    minAmount: import.meta.env.VITE_APP_INVEST_MIN_AMOUNT || "0.02",
    maxAmount: import.meta.env.VITE_APP_INVEST_MAX_AMOUNT || "300",
    firstDepositThreshold1: import.meta.env.VITE_APP_FIRST_DEPOSIT_THRESHOLD_1 || "0.05",
    firstDepositThreshold2: import.meta.env.VITE_APP_FIRST_DEPOSIT_THRESHOLD_2 || "0.1",
    firstDepositBonus1: import.meta.env.VITE_APP_FIRST_DEPOSIT_BONUS_1 || "0.005",
    firstDepositBonus2: import.meta.env.VITE_APP_FIRST_DEPOSIT_BONUS_2 || "0.01",
    qualifiedDirectMin: import.meta.env.VITE_APP_QUALIFIED_DIRECT_MINIMUM || "0.05",
    level1To2Min: import.meta.env.VITE_APP_LEVEL_1_TO_2_MIN_DEPOSIT || "0.02",
    level3To10Min: import.meta.env.VITE_APP_LEVEL_3_TO_10_MIN_DEPOSIT || "0.04",
    level11To15Min: import.meta.env.VITE_APP_LEVEL_11_TO_15_MIN_DEPOSIT || "0.06",
    level16To20Min: import.meta.env.VITE_APP_LEVEL_16_TO_20_MIN_DEPOSIT || "0.08",
    appTitle: import.meta.env.VITE_APP_TITLE || "StakeBnb",
  };

  const appTitle = import.meta.env.VITE_APP_TITLE || "StakeBnb";

  return (
    <section className="investment-info-section">
      <div className="investment-info-container">
        <div className="investment-info-header">
          <h2 className="investment-info-title">{`${appTitle} Investment Parameters`}</h2>
          <p className="investment-info-subtitle">
            Complete guide to investment requirements and bonus structures
          </p>
        </div>

        <div className="info-columns">
          {/* Left Column */}
          <div className="info-column">
            {/* Investment Limits */}
            <div className="info-category">
              <div className="category-header">
                <div className="category-icon">💰</div>
                <h3 className="category-title">Investment Limits</h3>
              </div>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-label">Minimum Investment</div>
                  <div className="info-value">
                    {investmentParams.minAmount} {symbol}
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-label">Maximum Investment</div>
                  <div className="info-value">
                    {investmentParams.maxAmount} {symbol}
                  </div>
                </div>
              </div>
            </div>

            {/* First Deposit Bonuses */}
            <div className="info-category">
              <div className="category-header">
                <div className="category-icon">🎁</div>
                <h3 className="category-title">First Deposit Bonuses</h3>
              </div>
              <div className="info-grid">
                <div className="info-card highlight">
                  <div className="info-label">Deposit ≥ {investmentParams.firstDepositThreshold1} {symbol}</div>
                  <div className="info-value bonus">
                    +{investmentParams.firstDepositBonus1} {symbol}
                  </div>
                  <div className="info-description">Bonus on first deposit of your direct Referrals</div>
                </div>
                <div className="info-card highlight">
                  <div className="info-label">Deposit ≥ {investmentParams.firstDepositThreshold2} {symbol}</div>
                  <div className="info-value bonus">
                    +{investmentParams.firstDepositBonus2} {symbol}
                  </div>
                  <div className="info-description">Bonus on first deposit of your direct Referrals</div>
                </div>
              </div>
            </div>  
          </div>

          {/* Right Column */}
          <div className="info-column">
            {/* Referral Requirements */}
            <div className="info-category">
              <div className="category-header">
                <div className="category-icon">👥</div>
                <h3 className="category-title">Referral Requirements</h3>
              </div>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-label">Qualified Direct Referral Minimum</div>
                  <div className="info-value">
                    {investmentParams.qualifiedDirectMin} {symbol}
                  </div>
                  <div className="info-description">
                    Minimum investment required for a referral to count as qualified
                  </div>
                </div>
              </div>
            </div>

            {/* Level Requirements */}
            <div className="info-category">
              <div className="category-header">
                <div className="category-icon">📊</div>
                <h3 className="category-title">Level Minimum Deposit Requirements</h3>
              </div>
              <div className="info-grid levels">
                <div className="info-card level">
                  <div className="level-badge">Level 1-2</div>
                  <div className="info-value">{investmentParams.level1To2Min}<span className="unit"> {symbol}</span></div>
                  <div className="info-description">Qualified Directs: MIN 0</div>
                </div>
                <div className="info-card level">
                  <div className="level-badge">Level 3-10</div>
                  <div className="info-value">{investmentParams.level3To10Min}<span className="unit"> {symbol}</span></div>
                  <div className="info-description">Qualified Directs: MIN 3</div>
                </div>
                <div className="info-card level">
                  <div className="level-badge">Level 11-15</div>
                  <div className="info-value">{investmentParams.level11To15Min}<span className="unit"> {symbol}</span></div>
                  <div className="info-description">Qualified Directs: MIN 5</div>
                </div>
                <div className="info-card level">
                  <div className="level-badge">Level 16-20</div>
                  <div className="info-value">{investmentParams.level16To20Min}<span className="unit"> {symbol}</span></div>
                  <div className="info-description">Qualified Directs: MIN 10</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="info-notice">
          <div className="notice-icon">ℹ️</div>
          <div className="notice-content">
            <strong>Important:</strong> All values are denominated in {symbol}. Please ensure you meet the minimum requirements before investing.
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentInfo;

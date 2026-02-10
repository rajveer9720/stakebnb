import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useContractData } from "../context/ContractDataContext";
import { getWalletSymbol } from "../../utils/ProviderUtils";
import { applyTheme } from "../../utils/colorUtils";
import "./HeroSection.css";

const HeroSection: React.FC = () => {
  const { data } = useContractData();
  const symbol = getWalletSymbol();

  useEffect(() => {
    applyTheme();
  }, []);

  const features = [
    {
      icon: "⚡",
      label: "Instant Tx",
      value: "< 2s",
    },
    {
      icon: "🔒",
      label: "Security",
      value: "100%",
    },
    {
      icon: "⛓️",
      label: "Blocks",
      value: "∞",
    },
  ];

  return (
    <section className="hero">
      <Container className="hero-container">
        <Row className="hero-main-row">
          <Col lg={7} className="hero-left">
            <div className="glitch-wrapper">
              <span className="protocol-badge">
                <span className="badge-dot"></span>
                PROTOCOL ACTIVE
              </span>
            </div>

            <h1 className="hero-title-matrix">
              <span
                className="title-line"
                data-text={import.meta.env.VITE_APP_HERO_HEADING}
              >
                {import.meta.env.VITE_APP_HERO_HEADING}
              </span>
            </h1>

            <div className="terminal-text">
              <span className="terminal-prompt">$</span>
              <span className="terminal-content">
                {import.meta.env.VITE_APP_HERO_SUBTITLE}
              </span>
            </div>

            <div className="hero-actions-matrix">
              <a
                href={import.meta.env.VITE_APP_PRESENTATION_LINK}
                target="_blank"
                className="btn-matrix btn-primary"
              >
                <span className="btn-content">
                  <span className="btn-icon">▶</span>
                  Presentation
                </span>
              </a>

              <a
                href={import.meta.env.VITE_APP_HERO_SMART_CONTRACT}
                target="_blank"
                className="btn-matrix btn-primary"
              >
                <span className="btn-content">
                  <span className="btn-icon">◈</span>
                  View Contract
                </span>
              </a>
            </div>
          </Col>

          <Col lg={5} className="hero-right">
            <div className="blockchain-viz">
              <div className="blockchain-header">
                <span className="header-label">CONTRACT STATUS</span>
                <span className="header-status">
                  <span className="status-dot"></span>
                  LIVE
                </span>
              </div>

              <div className="balance-display">
                <div className="balance-label">CONTRACT BALANCE</div>
                <div className="balance-value">
                  {data?.contractBalance?.toFixed(4) || "0.0000"}
                  <span className="balance-symbol">{symbol}</span>
                </div>
              </div>

              <div className="block-chain">
                {[0, 1, 2, 3].map((block) => (
                  <div
                    key={block}
                    className="block"
                    style={{ animationDelay: `${block * 0.2}s` }}
                  >
                    <div className="block-id">#{block + 1}</div>
                    <div className="block-bars">
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="feature-grid">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="feature-card"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <span className="feature-icon">{feature.icon}</span>
                    <span className="feature-label">{feature.label}</span>
                    <span className="feature-value">{feature.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        <div className="metrics-panel">
          <div className="metric">
            <div className="metric-icon">◆</div>
            <div className="metric-content">
              <div className="metric-label">Total Staked</div>
              <div className="metric-value">
                {data?.totalStaked?.toFixed(4) || 0} {symbol}
              </div>
            </div>
          </div>

          <div className="metric">
            <div className="metric-icon">◈</div>
            <div className="metric-content">
              <div className="metric-label">Active Users</div>
              <div className="metric-value">{data?.totalUsers || 0}</div>
            </div>
          </div>

          <div className="metric">
            <div className="metric-icon">◇</div>
            <div className="metric-content">
              <div className="metric-label">Contract Balance</div>
              <div className="metric-value">
                {data?.contractBalance?.toFixed(4) || 0} {symbol}
              </div>
            </div>
          </div>

          <div className="metric">
            <div className="metric-icon">◊</div>
            <div className="metric-content">
              <div className="metric-label">Total Ref Rewards</div>
              <div className="metric-value">
                {data?.totalRefReward?.toFixed(4) || 0} {symbol}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;

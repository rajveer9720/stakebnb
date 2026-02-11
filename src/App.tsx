import React, { useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ContractDataProvider } from "./components/context/ContractDataContext";
import { Web3ModalProvider } from "./providers/Web3ModalProvider";
import { Toaster } from "react-hot-toast";
import { applyTheme } from "./utils/colorUtils";

import {
  HeroSection,
  Footer,
  Deposit,
  Navbars,
  Referral,
  ReferralLinkData,
  Levels,
  ScrollToTopButton,
  InvestmentInfo,
} from "./components";

const App: React.FC = () => {
  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE || "";

    const favicon = document.querySelector(
      "link[rel*='icon']",
    ) as HTMLLinkElement;
    if (favicon) {
      favicon.href = import.meta.env.VITE_APP_FAVICON || "";
    }

    applyTheme();
  }, []);

  return (
    <Web3ModalProvider>
      <ContractDataProvider>
        <div className="App">
          <Toaster />
          <Navbars />
          <HeroSection />
          <div className="row">
              <div className="col-12">
                <InvestmentInfo />
              </div>
            </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <Deposit />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <ReferralLinkData />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Referral />
              </div>
            </div>
            
            <div className="row">
              <div className="col-12">
                <Levels />
              </div>
            </div>
          </div>
          <Footer />
          <ScrollToTopButton />
        </div>
      </ContractDataProvider>
    </Web3ModalProvider>
  );
  
};

export default App;

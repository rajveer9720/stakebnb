import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { ArrowUp } from "react-bootstrap-icons";
import { colors } from "../../utils/colorUtils";

const ScrollToTopButton: React.FC = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      onClick={scrollTop}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: showScroll ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "var(--card-bg, #333)",
        border: "none",
        boxShadow: `0px 2px 10px ${colors.shadowDefault}`,
        zIndex: 1000,
        transition: "all 0.3s ease",
      }}
    >
      <ArrowUp size={30} color={colors.textPrimary} />
    </Button>
  );
};

export default ScrollToTopButton;

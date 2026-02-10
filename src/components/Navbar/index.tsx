import { useEffect } from "react";
import { Navbar, Container, Nav, Button, Row, Col } from "react-bootstrap";
import { WalletConnect } from "../../components/index";
import { applyTheme, colors } from "../../utils/colorUtils";
import "./Navbar.css";

const Navbars = () => {
  const depositLink = import.meta.env.VITE_APP_NAVBAR_DEPOSIT_LINK || "";

  useEffect(() => {
    applyTheme();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Navbar
      className="py-2 py-lg-3 sticky-top"
      style={{
        backgroundColor: colors.navbarBg,
        boxShadow: `0 2px 10px ${colors.shadowDefault}`,
        zIndex: 1030,
        position: "fixed",
        top: 0,
        width: "100%",
        borderBottom: `1px solid ${colors.cardBorder}`,
        backdropFilter: "blur(10px)",
      }}
    >
      <Container>
        <Row className="w-100">
          <Col
            xs={12}
            lg={6}
            className="text-center text-lg-start mb-3 mb-lg-0"
          >
            <Navbar.Brand className="navbar-brand-custom" onClick={scrollToTop}>
              <img
                alt="Logo"
                src={import.meta.env.VITE_APP_LOGO || ""}
                className="logo"
                width={120}
              />
            </Navbar.Brand>
          </Col>

          <Col
            xs={12}
            lg={6}
            className="d-flex justify-content-center justify-content-lg-end"
          >
            <Nav className="w-100 d-flex gap-2 justify-content-center justify-content-lg-end align-items-center">
              <Button
              className="btn ms-2 rounded-pill fw-bold d-flex align-items-center"
              onClick={() => (window.location.href = depositLink)}
              style={{
                backgroundColor: colors.navbarButtonBg,
                color: colors.navbarButtonText,
                border: `1px solid ${colors.navbarButtonBg}`,
                height: "40px",
                transition: "all 0.3s ease",
                boxShadow: `0 2px 8px ${colors.shadowLight}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.shadowPrimary}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadowLight}`;
              }}
              >
              Deposit
              </Button>

              <div style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <WalletConnect />
              </div>
            </Nav>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Navbars;

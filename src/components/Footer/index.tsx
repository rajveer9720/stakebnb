import { colors } from "../../utils/colorUtils";

const Footer = () => {
  const companyName = import.meta.env.VITE_APP_TITLE || "";
  
  const bgColor = colors.navbarBg;
  const textColor = colors.textPrimary;

  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="footer-content text-center py-3">
        <p>
          {companyName} © {currentYear}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

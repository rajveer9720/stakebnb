import { colors } from "../../utils/colorUtils";
import { useContractData } from "../context/ContractDataContext";
import "./level.css";

const Levels = () => {
  const { data } = useContractData();
  const levelPercentages = [
    "3.0%",
    "1.0%",
    "1.0%",
    "1.0%",
    "1.0%",
    "1.0%",
    "1.0%",
    "1.0%",
    "1.0%",
    "1.0%",
    "0.5%",
    "0.5%",
    "0.5%",
    "0.5%",
    "0.5%",
    "0.2%",
    "0.2%",
    "0.2%",
    "0.2%",
    "0.2%",
  ];

  const totalLevels = levelPercentages.length;
  const downlineCount = data?.userDownlineCount || [];

  return (
    <section className="py-5 levels-section" style={{ color: colors.textPrimary || "#fff" }}>
      <div className="container">
        <h2
          className="text-center mb-4 fw-bold"
          style={{
            fontSize: "2rem",
            letterSpacing: "1px",
            color: "var(--heading-color)",
          }}
        >
          Users Invited by You
        </h2>

        <div className="custom-progress-container mb-4">
          <div className="custom-progress-bar" />
        </div>

        <div className="levels-grid">
          {Array.from({ length: totalLevels }, (_, index) => {
            const level = index + 1;
            const percentage = levelPercentages[index] || "";
            const isActive = false;

            return (
              <div
                key={level}
                className={`level-card ${isActive ? "is-active" : ""}`}
                aria-label={`Level ${level}`}
              >
                

                <div className="level-body">
                  <div className="level-header" >
                  <div className="level-number">Level {level}</div>
                  {percentage && (
                  <div className="level-badge1">{percentage}</div>
                )}
                </div>

                  <div className="level-count">{downlineCount[index] || 0}</div>

                  <div
                    style={{ fontSize: "0.8rem", opacity: 0.75, marginTop: 6 }}
                  >
                    Referrals
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Levels;

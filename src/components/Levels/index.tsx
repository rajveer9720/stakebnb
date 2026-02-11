import { colors } from "../../utils/colorUtils";
import { useContractData } from "../context/ContractDataContext";
import "./level.css";

const Levels = () => {
  const { data } = useContractData();
  const totalLevels = Number(import.meta.env.VITE_APP_TOTAL_LEVEL_LENGTH) || 20;
  const downlineCount = data?.userDownlineCount || [];

  return (
    <section className="py-5" style={{ color: colors.textPrimary || "#fff" }}>
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
            const percentage =
              import.meta.env[`VITE_APP_LEVEL_${level}_PERCENTAGE`] || "";
            const isActive = false;

            return (
              <div
                key={level}
                className={`level-card ${isActive ? "is-active" : ""}`}
                aria-label={`Level ${level}`}
              >
                {percentage && <div className="level-badge">{percentage}%</div>}

                <div className="level-number">Level {level}</div>

                <div className="level-count">{downlineCount[index] || 0}</div>

                <div
                  style={{ fontSize: "0.8rem", opacity: 0.75, marginTop: 6 }}
                >
                  Referrals
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

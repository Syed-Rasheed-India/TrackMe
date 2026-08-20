import React from "react";
import "./FocusStats.css";

const FocusStats = () => {
  return (
    <section className="focus-stats-section">
      <div className="focus-stats-container">

        {/* Card 1 */}
        <div className="focus-card weekly-card">
          <div className="card-header">
            <span>Most Focused Day</span>
            <div className="card-icon purple-icon">ϟ</div>
          </div>

          <div className="percentage">88%</div>
          <div className="increase">+12% vs last week</div>

          <div className="weekly-chart">
            <div className="bar" style={{ height: "14px" }}></div>
            <div className="bar" style={{ height: "22px" }}></div>
            <div className="bar" style={{ height: "28px" }}></div>
            <div className="bar active" style={{ height: "43px" }}></div>
            <div className="bar" style={{ height: "24px" }}></div>
            <div className="bar" style={{ height: "16px" }}></div>
            <div className="bar" style={{ height: "10px" }}></div>
          </div>

          <div className="days">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>
        </div>


        {/* Card 2 */}
        <div className="focus-card progress-card">
          <div className="card-header">
            <span>Focus Progress Score</span>
            <div className="dots">•••</div>
          </div>

          <div className="progress-score">92%</div>

          <div className="top-badge">⌁ Top 5%</div>

          <div className="monthly-chart">
            <div className="month-column">
              <div className="month-bar" style={{ height: "38px" }}></div>
              <span>Feb</span>
            </div>

            <div className="month-column">
              <div className="month-bar" style={{ height: "53px" }}></div>
              <span>Mar</span>
            </div>

            <div className="month-column active-month">
              <div className="score-label">92</div>
              <div className="month-bar" style={{ height: "66px" }}></div>
              <span>Apr</span>
            </div>

            <div className="month-column">
              <div className="month-bar" style={{ height: "62px" }}></div>
              <span>May</span>
            </div>
          </div>
        </div>


        {/* Card 3 */}
        <div className="focus-card revision-card">
          <div className="card-header">
            <span>Revision Goal</span>
            <div className="card-icon blue-icon">⚑</div>
          </div>

          <div className="revision-percentage">76%</div>

          <div className="goal-text">
            Your goal: 12h/month
          </div>

          <div className="progress-label">
            <span>Progress</span>
            <span>9.1h</span>
          </div>

          <div className="progress-track">
            <div className="progress-fill">
              <div className="progress-dot"></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FocusStats;
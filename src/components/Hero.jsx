import "./Hero.css";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");

    if (token) {
      // Already logged in
      navigate("/pomodoro");
    } else {
      // New user
      navigate("/signup");
    }
  };

  return (
    <main className="hero">

      {/* Small badge */}
      <div className="hero-badge">
        ✨ AI-powered learning
      </div>

      {/* Main heading */}
      <h1>
        Track what you <span className="purple">learn</span>. Revise
        <br />
        before you <span className="blue">forget</span>.
      </h1>

      {/* Description */}
      <p className="hero-description">
        More than a timer — it learns your habits, tracks your focus, and reminds you to revise at
        <br />
        the perfect time.
      </p>

      {/* Buttons */}
      <div className="hero-buttons">

        <button
          className="hero-get-started"
          onClick={handleGetStarted}
        >
          Get Started
          <span>→</span>
        </button>

        <button className="hero-explore">
          Explore more
        </button>

      </div>

    </main>
  );
}

export default Hero;
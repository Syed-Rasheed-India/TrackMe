import "./Hero.css";

function Hero() {
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

        <button className="hero-get-started">
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

import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbars">

      {/* Logo */}
      <div className="navbar-logo">
        <img
          src="/LogoV1TrackMe.png"
          alt="TrackMe logo"
        />

        <p>TrackMe</p>
      </div>

      {/* Get Started */}
      <button className="navbar-button">
        Get Started
        <span>→</span>
      </button>

    </nav>
  );
}

export default Navbar;
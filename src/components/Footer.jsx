import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">

      {/* LOGO */}
      <div className="navbar-logo">

        <img
          src="/LogoV1TrackMe.png"
          alt="TrackMe logo"
        />

        <p>TrackMe</p>

      </div>


      {/* LINKS */}
      <nav className="options">

        <a href="/privacy-policy">
          Privacy Policy
        </a>

        <a href="/terms">
          Terms & Conditions
        </a>

        <a href="/contact">
          Contact Us
        </a>

        <a href="/blog">
          Blog
        </a>

      </nav>


      {/* COPYRIGHT */}
      <div className="copyright">

        <p>
          © 2024 TrackMe.AI. All rights reserved.
        </p>

      </div>

    </footer>
  )
}

export default Footer
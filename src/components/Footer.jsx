import React from 'react'
import './Footer.css';

function Footer() {
  return (
    <div className="footer">
        <div className="navbar-logo">
            <img
          src="/LogoV1TrackMe.png"
          alt="TrackMe logo"
        />

            <p>TrackMe</p>
        </div>
        <div className="options">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms and Conditions</a>
            <a href="#">Contact Us</a>
            <a href="#">Blog</a>
        </div>
        <div className="copyright">
            <p>© 2024 TrackMe.AI. All rights reserved.</p>
        </div>

    </div>
  )
}

export default Footer
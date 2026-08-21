import React from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    let LoginNavigate = useNavigate()
  return (
    <div className="signup-page">

      {/* LEFT SIDE */}
      <div className="signup-left">

        <div className="quote-mark">“</div>

        <div className="left-content">
          <h1>
            Every focus session is
            <br />
            a step closer to who
            <br />
            you're becoming.
          </h1>

          <p>
            Small daily focus. Big long-term growth.
          </p>
        </div>

        <div className="slider-indicator">
          <span className="active-dot"></span>
          <span></span>
          <span></span>
        </div>

        <div className="bottom-decoration">
          <div className="decoration-box box-one"></div>
          <div className="decoration-box box-two"></div>
          <div className="decoration-box box-three"></div>
          <div className="decoration-circle"></div>
        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="signup-right">

        <div className="signup-form-container">

          

          <h2>Create your account</h2>

          <p className="signup-subtitle">
            Start tracking your focus and revision today.
          </p>


          {/* Full Name */}
          <div className="input-group">
            <label>FULL NAME</label>

            <input
              type="text"
              placeholder="Jane Doe"
            />
          </div>


          {/* Email */}
          <div className="input-group">
            <label>EMAIL ADDRESS</label>

            <input
              type="email"
              placeholder="name@example.com"
            />
          </div>


          {/* Password */}
          <div className="input-group password-group">
            <label>PASSWORD</label>

            <div className="password-input">
              <input
                type="password"
                placeholder="Create a strong password"
              />

              <span className="eye-icon">◉</span>
            </div>
          </div>


          {/* Terms */}
          <div className="terms">
            <input type="checkbox" id="terms" />

            <label htmlFor="terms">
              I agree to the{" "}
              <a href="#">Terms & Conditions</a>
              {" "}and{" "}
              <a href="#">Privacy Policy</a>.
            </label>
          </div>


          {/* Signup Button */}
          <button className="signup-button">
            <span>Sign Up</span>
            <span className="arrow">→</span>
          </button>


          {/* Divider */}
          <div className="or-divider">
            <span></span>
            <p>Or sign up with</p>
            <span></span>
          </div>


          {/* Social Login */}
          <div className="social-login">

            <button className="social-button">
              <span className="google-icon">G</span>
              <span>Google</span>
            </button>

            <button className="social-button">
              <span className="apple-icon">●</span>
              <span>Apple</span>
            </button>

          </div>


          {/* Login */}
          <p className="login-text">
            Already have an account?{" "}
            <a href="#" onClick={()=> LoginNavigate("/login")}>Login</a>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;
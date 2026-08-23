import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">

      {/* ================= LEFT SIDE ================= */}

      <div className="login-left">

        <div className="login-quote-mark">“</div>

        <div className="login-left-content">
          <h1>
            Consistency Beats Motivation
            <br />
            <span style={{ color: "#a98bc9" }}>
                Welcome back — let's
            </span>
            <br />
            keep the streak alive.
            </h1>
          <p>
            Dive back into your focus
state and conquer today's goals.
          </p>
        </div>

        <div className="login-slider-indicator">
          <span className="active-dot"></span>
          <span></span>
          <span></span>
        </div>

        <div className="login-bottom-decoration">
          <div className="login-decoration-box box-one"></div>
          <div className="login-decoration-box box-two"></div>
          <div className="login-decoration-box box-three"></div>
          <div className="login-decoration-circle"></div>
        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="login-right">

        <div className="login-form-container">

          <h2>Welcome back</h2>

          <p className="login-subtitle">
            Continue tracking your focus and revision.
          </p>


          {/* EMAIL */}

          <div className="login-input-group">

            <label>EMAIL ADDRESS</label>

            <input
              type="email"
              placeholder="name@example.com"
            />

          </div>


          {/* PASSWORD */}

          <div className="login-input-group">

            <div className="login-password-label">

              <label>PASSWORD</label>

              <a href="#">
                Forgot password?
              </a>

            </div>

            <div className="login-password-input">

              <input
                type="password"
                placeholder="Enter your password"
              />

              <span className="login-eye-icon">
                ◉
              </span>

            </div>

          </div>


          {/* REMEMBER ME */}

          <div className="remember-me">

            <input
              type="checkbox"
              id="remember"
            />

            <label htmlFor="remember">
              Remember me
            </label>

          </div>


          {/* LOGIN BUTTON */}

          <button className="login-button" onClick={()=>navigate("/pomodoro")}>

            <span>Login</span>

            <span className="login-arrow">
              →
            </span>

          </button>


          {/* DIVIDER */}

          <div className="login-or-divider">

            <span></span>

            <p>Or continue with</p>

            <span></span>

          </div>


          {/* SOCIAL LOGIN */}

          <div className="login-social">

            <button className="login-social-button">

              <span className="login-google-icon">
                G
              </span>

              <span>
                Google
              </span>

            </button>


            <button className="login-social-button">

              <span className="login-apple-icon">
                ●
              </span>

              <span>
                Apple
              </span>

            </button>

          </div>


          {/* SIGNUP */}

          <p className="signup-text">

            Don't have an account?{" "}

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();   // use for Dont perform the "a" href and navigate handle that
                navigate("/signup");
              }}
            >
              Create account
            </a>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
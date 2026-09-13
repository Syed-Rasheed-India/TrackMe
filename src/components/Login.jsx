import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://trackme-backend-25ut.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // Store JWT
      localStorage.setItem("token", data.token);

      // Store logged-in user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Login successful
      navigate("/pomodoro");

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ================= LEFT SIDE ================= */}

      <div className="login-left">

        <div className="login-quote-mark">
          “
        </div>

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

        <form
          className="login-form-container"
          onSubmit={handleLogin}
        >

          <h2>
            Welcome back
          </h2>

          <p className="login-subtitle">
            Continue tracking your focus and revision.
          </p>


          {/* EMAIL */}

          <div className="login-input-group">

            <label>
              EMAIL ADDRESS
            </label>

            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>


          {/* PASSWORD */}

          <div className="login-input-group">

            <div className="login-password-label">

              <label>
                PASSWORD
              </label>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>

            </div>


            <div className="login-password-input">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="login-eye-icon"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={{ cursor: "pointer" }}
              >
                {showPassword ? "◉" : "◌"}
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


          {/* ERROR */}

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            <span>
              {loading ? "Logging in..." : "Login"}
            </span>

            {!loading && (
              <span className="login-arrow">
                →
              </span>
            )}

          </button>


          {/* DIVIDER */}

          <div className="login-or-divider">

            <span></span>

            <p>
              Or continue with
            </p>

            <span></span>

          </div>


          {/* SOCIAL LOGIN */}

          {/* <div className="login-social">

            <button
              type="button"
              className="login-social-button"
            >

              <span className="login-google-icon">
                G
              </span>

              <span>
                Google
              </span>

            </button>


            <button
              type="button"
              className="login-social-button"
            >

              <span className="login-apple-icon">
                ●
              </span>

              <span>
                Apple
              </span>

            </button>

          </div> */}


          {/* SIGNUP */}

          <p className="signup-text">

            Don't have an account?{" "}

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
            >
              Create account
            </a>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;
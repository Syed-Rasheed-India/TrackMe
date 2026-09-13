import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();

  // =====================================
  // FORM STATES
  // =====================================

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // =====================================
  // HANDLE SIGNUP
  // =====================================

  const handleSignup = async (e) => {

    e.preventDefault();

    setError("");


    // =====================================
    // FRONTEND VALIDATION
    // =====================================

    if (!fullName.trim()) {

      setError("Please enter your full name.");

      return;

    }


    if (!email.trim()) {

      setError("Please enter your email address.");

      return;

    }


    if (!password) {

      setError("Please enter a password.");

      return;

    }


    if (password.length < 6) {

      setError(
        "Password must be at least 6 characters."
      );

      return;

    }


    if (!termsAccepted) {

      setError(
        "Please agree to the Terms & Conditions and Privacy Policy."
      );

      return;

    }


    try {

      setLoading(true);


      // =====================================
      // SEND DATA TO BACKEND
      // =====================================

      const response = await fetch(
        "https://trackme-backend-25ut.onrender.com/api/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            fullName,
            email,
            password
          })
        }
      );


      const data = await response.json();


      // =====================================
      // SIGNUP FAILED
      // =====================================

      if (!response.ok) {

        setError(
          data.message || "Signup failed."
        );

        return;

      }


      // =====================================
      // SIGNUP SUCCESSFUL
      // =====================================

      // Store JWT token
      localStorage.setItem(
        "token",
        data.token
      );


      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      // =====================================
      // ONLY NOW GO TO POMODORO
      // =====================================

      navigate("/pomodoro");


    } catch (error) {

      console.error(
        "SIGNUP ERROR:",
        error
      );


      setError(
        "Unable to connect to server. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // UI
  // =====================================

  return (

    <div className="signup-page">


      {/* =====================================
          LEFT SIDE
          ===================================== */}

      <div className="signup-left">


        <div className="quote-mark">

          “

        </div>


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



      {/* =====================================
          RIGHT SIDE
          ===================================== */}

      <div className="signup-right">


        <div className="signup-form-container">


          <h2>

            Create your account

          </h2>


          <p className="signup-subtitle">

            Start tracking your focus and revision today.

          </p>



          {/* =====================================
              ERROR MESSAGE
              ===================================== */}

          {error && (

            <div className="signup-error">

              {error}

            </div>

          )}



          {/* =====================================
              FORM
              ===================================== */}

          <form onSubmit={handleSignup}>


            {/* Full Name */}

            <div className="input-group">

              <label>

                FULL NAME

              </label>


              <input

                type="text"

                placeholder="Jane Doe"

                value={fullName}

                onChange={(e) =>
                  setFullName(e.target.value)
                }

              />

            </div>



            {/* Email */}

            <div className="input-group">

              <label>

                EMAIL ADDRESS

              </label>


              <input

                type="email"

                placeholder="name@example.com"

                value={email}

                onChange={(e) =>
                  setEmail(e.target.value)
                }

              />

            </div>



            {/* Password */}

            <div className="input-group password-group">

              <label>

                PASSWORD

              </label>


              <div className="password-input">


                <input

                  type="password"

                  placeholder="Create a strong password"

                  value={password}

                  onChange={(e) =>
                    setPassword(e.target.value)
                  }

                />


                <span className="eye-icon">

                  ◉

                </span>


              </div>

            </div>



            {/* =====================================
                TERMS
                ===================================== */}

            <div className="terms">


              <input

                type="checkbox"

                id="terms"

                checked={termsAccepted}

                onChange={(e) =>
                  setTermsAccepted(e.target.checked)
                }

              />


              <label htmlFor="terms">

                I agree to the{" "}

                <a href="#">

                  Terms & Conditions

                </a>

                {" "}and{" "}

                <a href="#">

                  Privacy Policy

                </a>

                .

              </label>


            </div>



            {/* =====================================
                SIGNUP BUTTON
                ===================================== */}

            <button

              type="submit"

              className="signup-button"

              disabled={loading}

            >


              <span>

                {loading
                  ? "Creating account..."
                  : "Sign Up"}

              </span>


              {!loading && (

                <span className="arrow">

                  →

                </span>

              )}


            </button>


          </form>



          {/* =====================================
              DIVIDER
              ===================================== */}

          <div className="or-divider">

            <span></span>

            <p>

              Or sign up with

            </p>

            <span></span>

          </div>



          {/* =====================================
              SOCIAL LOGIN
              ===================================== */}

          {/* <div className="social-login">


            <button

              type="button"

              className="social-button"

            >

              <span className="google-icon">

                G

              </span>


              <span>

                Google

              </span>

            </button>



            <button

              type="button"

              className="social-button"

            >

              <span className="apple-icon">

                ●

              </span>


              <span>

                Apple

              </span>

            </button>


          </div> */}



          {/* =====================================
              LOGIN
              ===================================== */}

          <p className="login-text">


            Already have an account?{" "}


            <a

              href="#"

              onClick={(e) => {

                e.preventDefault();

                navigate("/login");

              }}

            >

              Login

            </a>


          </p>


        </div>


      </div>


    </div>

  );

};


export default Signup;
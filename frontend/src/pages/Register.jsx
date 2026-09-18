import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Mail, CheckCircle } from "lucide-react";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState("register");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =========================================================
     REGISTER
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.phoneNumber.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phoneNumber: formData.phoneNumber.trim(),
        }
      );

      console.log("Registration response:", response.data);

      setSuccess(
        response.data?.message ||
          "OTP has been sent to your email."
      );

      setStep("otp");

      setOtp("");

    } catch (err) {
      console.error("Registration error:", err);

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "";

      const message = backendMessage.toLowerCase();

      if (message.includes("email already exists")) {
        setError("An account with this email already exists.");
      } else if (
        message.includes("phone number already exists")
      ) {
        setError("This phone number is already registered.");
      } else {
        setError(
          backendMessage ||
            "Unable to send verification OTP. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     VERIFY OTP
  ========================================================= */

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanOtp = otp.trim();

    if (!/^[0-9]{6}$/.test(cleanOtp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register/verify",
        {
          email: formData.email.trim(),
          otp: cleanOtp,
        }
      );

      console.log("OTP verification response:", response.data);

      setSuccess(
        response.data?.message ||
          "Email verified. User registered successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1800);

    } catch (err) {
      console.error("OTP verification error:", err);

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "";

      const message = backendMessage.toLowerCase();

      if (message.includes("otp has expired")) {
        setError(
          "Your OTP has expired. Please register again to receive a new OTP."
        );
      } else if (message.includes("invalid otp")) {
        setError("Invalid OTP. Please check the code and try again.");
      } else if (
        message.includes("registration request not found")
      ) {
        setError(
          "Registration session not found. Please register again."
        );
      } else if (message.includes("email already registered")) {
        setError("This email is already registered.");
      } else if (
        message.includes("phone number already registered")
      ) {
        setError("This phone number is already registered.");
      } else {
        setError(
          backendMessage ||
            "Unable to verify OTP. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     BACK TO REGISTRATION
  ========================================================= */

  const handleBackToRegister = () => {
    setStep("register");
    setOtp("");
    setError("");
    setSuccess("");
  };

  return (
    <main className="register-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="register-background">
        <div className="register-grid"></div>
        <div className="register-red-glow"></div>
      </div>


      <section className="register-container">

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div className="register-brand-panel">

          <Link to="/" className="register-logo">
            OneDay<span>Wear</span>
          </Link>


          <div className="register-brand-content">

            <p className="register-eyebrow">
              ONE DAY. ONE LOOK.
            </p>


            {/* =================================================
                REGISTER IMAGE
            ================================================= */}

            <div className="register-visual">

              <div className="register-visual-image"></div>

            </div>


            <p className="register-brand-description">
              Discover premium fashion for your
              special moments. Wear the look.
              Make the moment.
            </p>

          </div>


          <div className="register-side-number">
            {step === "register" ? "01 / 02" : "02 / 02"}
          </div>

        </div>


        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="register-form-panel">

          {/* =================================================
              STEP 1 — REGISTER
          ================================================= */}

          {step === "register" && (

            <>

              <div className="register-form-header">

                <p className="register-label">
                  CREATE ACCOUNT
                </p>

                <h2>
                  Welcome to
                  <br />
                  <span>OneDayWear.</span>
                </h2>

                <p className="register-subtitle">
                  Create your account and start
                  discovering your next look.
                </p>

              </div>


              <form
                className="register-form"
                onSubmit={handleSubmit}
              >

                {/* FULL NAME */}

                <div className="register-field">

                  <label htmlFor="fullName">
                    FULL NAME
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="register-field">

                  <label htmlFor="email">
                    EMAIL ADDRESS
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />

                </div>


                {/* PHONE */}

                <div className="register-field">

                  <label htmlFor="phoneNumber">
                    PHONE NUMBER
                  </label>

                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    autoComplete="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />

                  <small>
                    Enter a 10-digit mobile number
                  </small>

                </div>


                {/* PASSWORD */}

                <div className="register-field">

                  <label htmlFor="password">
                    PASSWORD
                  </label>

                  <div className="register-password-wrapper">

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      minLength="6"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>


                {/* CONFIRM PASSWORD */}

                <div className="register-field">

                  <label htmlFor="confirmPassword">
                    CONFIRM PASSWORD
                  </label>

                  <div className="register-password-wrapper">

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>


                {/* ERROR */}

                {error && (
                  <div className="register-error">
                    {error}
                  </div>
                )}


                {/* SUCCESS */}

                {success && (
                  <div className="register-success">
                    {success}
                  </div>
                )}


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="register-submit"
                  disabled={loading}
                >

                  <span>
                    {loading
                      ? "SENDING OTP..."
                      : "CREATE ACCOUNT"}
                  </span>

                  {!loading && (
                    <ArrowRight size={18} />
                  )}

                </button>


                {/* LOGIN */}

                <p className="register-login-text">
                  Already have an account?

                  <Link to="/login">
                    LOGIN
                  </Link>
                </p>

              </form>

            </>

          )}


          {/* =================================================
              STEP 2 — OTP
          ================================================= */}

          {step === "otp" && (

            <div className="register-otp-screen">

              <div className="register-otp-icon">
                <Mail size={25} />
              </div>


              <div className="register-form-header">

                <p className="register-label">
                  EMAIL VERIFICATION
                </p>

                <h2>
                  Verify your
                  <br />
                  <span>Email.</span>
                </h2>

                <p className="register-subtitle">
                  We've sent a 6-digit verification code
                  to your email address.
                </p>

              </div>


              <div className="register-otp-email">
                {formData.email}
              </div>


              <form
                className="register-form register-otp-form"
                onSubmit={handleVerifyOtp}
              >

                <div className="register-field">

                  <label htmlFor="otp">
                    VERIFICATION CODE
                  </label>

                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const value =
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);

                      setOtp(value);
                      setError("");
                    }}
                    maxLength="6"
                    required
                    autoFocus
                  />

                </div>


                {/* ERROR */}

                {error && (
                  <div className="register-error">
                    {error}
                  </div>
                )}


                {/* SUCCESS */}

                {success && (
                  <div className="register-success">
                    {success}
                  </div>
                )}


                {/* VERIFY */}

                <button
                  type="submit"
                  className="register-submit"
                  disabled={loading}
                >

                  <span>
                    {loading
                      ? "VERIFYING..."
                      : "VERIFY EMAIL"}
                  </span>

                  {!loading && (
                    <CheckCircle size={18} />
                  )}

                </button>


                {/* BACK */}

                <button
                  type="button"
                  className="register-back-button"
                  onClick={handleBackToRegister}
                  disabled={loading}
                >
                  ← BACK TO REGISTRATION
                </button>

              </form>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:8080/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      localStorage.setItem("token", data.token);
localStorage.setItem("userEmail", email);
localStorage.setItem("userRole", data.role);

if (data.role === "ADMIN") {
  navigate("/admin", { replace: true });
} else {
  navigate("/", { replace: true });
}
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      {/* Dark Spider-Man overlay */}
      <div className="login-overlay"></div>

      <section className="login-content">

        {/* Left side branding */}
        <div className="login-brand">

          <div className="login-spider-symbol">
            🕷
          </div>

          <p className="login-eyebrow">
            ONE DAY WEAR
          </p>

          <h1>
            STEP INTO
            <br />
            THE MOMENT.
          </h1>

          <p className="login-tagline">
            Premium outfits.
            <br />
            One day. One look.
          </p>

        </div>

        {/* Login box */}
        <div className="login-card">

          <div className="login-card-header">

            <p>ONE DAY WEAR</p>

            <h2>WELCOME BACK</h2>

            <span>
              Sign in to continue your journey.
            </span>

          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* Email */}
            <div className="login-field">

              <label>
                EMAIL
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            {/* Password */}
            <div className="login-field">

              <label>
                PASSWORD
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "SIGNING IN..."
                : "SIGN IN"}
            </button>

          </form>

          {/* Register */}
          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              CREATE ACCOUNT
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Login;
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import "../styles/Login.css";
import axios from "axios";

function Login() {
  const [error,setError]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
        navigate("/home");
    }

}, [navigate]);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill email and password");
      return;
    }

    if (password.length < 4) {
      setError("Password too short");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("userName", response.data.user.name);
      navigate("/home");

    } catch (error) {
      setError(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          NOVA AI
        </div>

        <h2 className="login-title">
          Welcome Back
        </h2>

        <p className="login-subtitle">
          Sign in to continue
        </p>

        <div className="input-group">
          <FaUser className="input-icon" />

          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email Address"
          />
        </div>

        <div className="input-group">

          <FaLock className="input-icon" />

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password"
          />

          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

        <div className="login-links">

          <Link to="/forgot">
            Forgot Password?
          </Link>

        </div>

        <button className="login-btn" onClick={handleLogin}>
            LOGIN
        </button>

        {error && <p className="error-text">{error}</p>}

        <p className="signup-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="signup-link">
            Create Account
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;
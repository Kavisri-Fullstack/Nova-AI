import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Signup.css";
import axios from "axios";

function Signup() {
  
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password
        }
      );

      console.log(res.data);

      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-page">

      {/* Animated Background */}
      <div className="signup-bg"></div>

      {/* Orb */}
      <div className="signup-orb">
        <div className="ring ring1"></div>
        <div className="ring ring2"></div>
        <div className="core"></div>
      </div>

      <motion.form
        className="signup-card"
        onSubmit={handleSignup}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .6 }}
      >

        <h1>Create Account</h1>

        <p className="subtitle">
          Join NOVA AI
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <div className="password-box">

          <input
            type={showPassword ? "text":"password"}
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            type="button"
            className="eye-btn"
            onClick={()=>setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>

        </div>

        <input
          type={showPassword ? "text":"password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
        />

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="signup-btn"
        >
          CREATE ACCOUNT
        </button>

        <p className="login-link">
          Already have an account?

          <span onClick={()=>navigate("/")}>
            Login
          </span>

        </p>

      </motion.form>

    </div>
  );
}

export default Signup;
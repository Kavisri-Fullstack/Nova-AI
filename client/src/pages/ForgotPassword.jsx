import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
  e.preventDefault();

  setMessage("");

  if (!email || !newPassword || !confirmPassword) {
    setMessage("Please fill all fields");
    return;
  }

  if (newPassword !== confirmPassword) {
    setMessage("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/forgot",
      {
        email,
        newPassword,
      }
    );

    setMessage(response.data.message);

    // optional redirect after success
    setTimeout(() => {
      navigate("/");
    }, 1500);

  } catch (error) {
    setMessage(
      error.response?.data?.message || "Something went wrong"
    );
  }
};

  return (
    <div className="forgot-page">

      {/* Animated Background */}
      <div className="forgot-bg"></div>

      {/* Orb */}
      <div className="forgot-orb">
        <div className="ring ring1"></div>
        <div className="ring ring2"></div>
        <div className="core"></div>
      </div>

      <motion.form
        className="forgot-card"
        onSubmit={handleReset}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Forgot Password</h1>

        <p className="subtitle">
          Enter your email to reset your password
        </p>

        <div className="input-box">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {message && (
          <p className="message-text">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="reset-btn"
        >
          SEND RESET LINK
        </button>

        <p className="back-login">
          Remember your password?

          <span onClick={() => navigate("/")}>
            Login
          </span>
        </p>

      </motion.form>

    </div>
  );
}

export default ForgotPassword;
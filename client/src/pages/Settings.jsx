import "../styles/Settings.css";
import axios from "axios";
import { useState } from "react";
import {
  FaCog,
  FaMoon,
  FaMicrophone,
  FaTrashAlt,
  FaInfoCircle
} from "react-icons/fa";

function Settings({theme, setTheme}) {
  const [showAbout, setShowAbout] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleClearHistory = async () => {

    const userId = localStorage.getItem("userId");

    if (!window.confirm("Clear all chat history?")) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/auth/chat/${userId}`
      );

      alert("History Cleared");

    } catch (err) {

      console.log(err);

      alert("Failed to clear history");

    }
  };
  return (
    <div className="settings-page">

      <div className="settings-card">

        <h1 className="settings-title">
            <FaCog className="settings-icon"/>
            Settings
        </h1>

        <div
            className="setting-item"
            onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
            }
        >
            <FaMoon className="item-icon" />

            <span>
                Theme : {theme === "dark" ? "Dark" : "Light"}
            </span>
        </div>

        <div
          className="setting-item"
          onClick={() => setShowComingSoon(true)}

        >
          Voice
        </div>
        {showComingSoon && (
          <div className="coming-soon-popup">
            <h3>🎤 Voice Settings</h3>

            <p>
              Coming Soon
            </p>

            <button
              onClick={() => setShowComingSoon(false)}
            >
              OK
            </button>
          </div>
        )}

        <div
          className="setting-item"
          onClick={handleClearHistory}
          style={{ cursor: "pointer" }}
        >
          <FaTrashAlt className="item-icon" />
          <span>Clear Chat History</span>
        </div>

        <div
            className="setting-item"
            onClick={() => setShowAbout(true)}
        >
            <FaInfoCircle className="item-icon"/>
            <span>About NOVA</span>
        </div>

      </div>

      {showAbout && (

      <div
          className="about-overlay"
          onClick={() => setShowAbout(false)}
      >

      <div
          className="about-modal"
          onClick={(e)=>e.stopPropagation()}
      >

      <h2>NOVA AI</h2>

      <p className="about-version">
      Version 1.0.0
      </p>

      <p className="about-text">

      NOVA AI is a modern AI assistant designed for
      smart conversations, voice interaction,
      chat history management and productivity.

      </p>

      <div className="about-details">

      <p><strong>Developer</strong> : Kavisri</p>

      <p><strong>Frontend</strong> : React</p>

      <p><strong>Backend</strong> : Node.js + Express</p>

      <p><strong>Database</strong> : MongoDB</p>

      <p><strong>AI</strong> : OpenRouter API</p>

      </div>

      <button
      className="about-close"
      onClick={()=>setShowAbout(false)}
      >

      Close

      </button>

      </div>

      </div>

      )}

    </div>
  );
}

export default Settings;
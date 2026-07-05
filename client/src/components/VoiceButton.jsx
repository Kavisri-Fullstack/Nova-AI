import axios from "axios";
import '../styles/VoiceButton.css';

function VoiceButton({ setStatus, sendMessage }) {

  const detectLanguage = (text) => {
    const tamilRegex = /[\u0B80-\u0BFF]/;

    if (tamilRegex.test(text)) {
      return "ta-IN"; // Tamil
    }

    // simple fallback rules
    if (text.match(/[a-zA-Z]/)) {
      return "en-US"; // English
    }

    return "en-US";
  };

  // 🔊 Better Human Voice
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();

      const tamil = voices.find(v => v.lang.includes("ta"));
      const english = voices.find(v => v.lang.includes("en"));

      const lang = /[\u0B80-\u0BFF]/.test(text) ? "ta-IN" : "en-US";

      utterance.lang = lang;
      utterance.voice =
        lang === "ta-IN" ? tamil || english : english || voices[0];

      utterance.rate = 0.9;
      utterance.pitch = 1;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    // voices load ஆக delay இருக்கும் → fix
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }
  };

  // 🎤 Start Listening
  const startListening = () => {

    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus("Listening...");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;

      setStatus("Thinking...");

      const reply = await sendMessage(transcript,true);

      if (reply) {
        speak(reply);
        setStatus("Ready");
      } else {
        setStatus("Error");
      }
    };

    recognition.onerror = () => {
      setStatus("Error");
    };

    recognition.onend = () => {

      if (window.speechSynthesis.speaking === false) {
        setStatus("Ready");
      }

    };

    recognition.start();

  };

  return (

    <button
      className="voice-btn"
      onClick={startListening}
    >
      🎤
    </button>

  );

}

export default VoiceButton;
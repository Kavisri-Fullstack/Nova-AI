import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/Header.css";
import axios from "axios";
import "../styles/Chat.css";
import Header from "../components/Header";
import VoiceButton from "../components/VoiceButton";
import Sidebar from "../components/Sidebar";

function MainLayout({theme,setTheme}) {

  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("Ready");
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("home");
  const [isNewChat, setIsNewChat] = useState(true);
  const chatEndRef = useRef(null);

  

  const loadChat = (selectedChat) => {
    if (!selectedChat) return;

    setChat([]);

    const formatted = [];

    for (let i = 0; i < selectedChat.messages.length; i += 2) {

      formatted.push({

        message: selectedChat.messages[i]?.content || "",

        reply: selectedChat.messages[i + 1]?.content || ""

      });

    }

    setChat(formatted);

    setIsNewChat(false);

    setView("home");
    setSidebarOpen(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [chat]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {

      localStorage.clear();

      navigate("/");

  };

    const clearHistory = async () => {
      const userId = localStorage.getItem("userId");

      if (!window.confirm("Clear all chat history?")) return;

      try {
        await axios.delete(
          `https://nova-ai-txaw.onrender.com/api/auth/chat/${userId}`
        );

        setHistory([]);
        setChat([]);
        setView("home");

      } catch (err) {
        console.log(err);
      }
    };

    const deleteHistory = async (chatId) => {

      try {

        await axios.delete(
          `https://nova-ai-txaw.onrender.com/api/auth/chat/delete/${chatId}`
        );

        setHistory(prev =>
          prev.filter(chat => chat._id !== chatId)
        );

        setChat([]);
        setView("home");

      } catch (err) {

        console.log(err);

      }

    };

    const togglePinHistory = async (chatId) => {

    const userId = localStorage.getItem("userId");

    try {

      await axios.patch(
        `https://nova-ai-txaw.onrender.com/api/auth/chat/pin/${chatId}`
      );

      const res = await axios.get(
        `https://nova-ai-txaw.onrender.com/api/auth/chat/${userId}`
      );

      setHistory(res.data.chats);

    } catch (err) {

      console.log(err);

    }

  };

    const renameHistory = async (chatId, title) => {

      if (!title.trim()) return;

      try {

        await axios.put(
          `https://nova-ai-txaw.onrender.com/api/auth/chat/rename/${chatId}`,
          {
            title
          }
        );

        await fetchChats();

      } catch (err) {

        console.log(err);

      }

    };

    const fetchChats = async () => {
      const userId = localStorage.getItem("userId");
        try {
          const res = await axios.get(
            `https://nova-ai-txaw.onrender.com/api/auth/chat/${userId}`
          );

          setHistory(res.data.chats);
        } catch (err) {
          console.log(err);
        }
      };

    useEffect(() => {

      fetchChats();
    }, []);

    const sendMessage = async (text, shouldSpeak = false) => {
      const userId = localStorage.getItem("userId");

      if (!userId) return null;

      setStatus("Thinking...");

      const res = await axios.post("https://nova-ai-txaw.onrender.com/chat", {
        userId,
        message: text,
        newChat:isNewChat
      });

      setChat((prev) => [
        ...prev,
        {
          message: text,
          reply: res.data.reply,
        },
      ]);
      setIsNewChat(false);

      // 🔥 ONLY speak if allowed
      if (shouldSpeak) {
        setStatus("Speaking...");
        return res.data.reply;
      }
      await fetchChats();
      setStatus("Ready");
      return res.data.reply;
    };

    const displayChats = chat;
  
  return (
    <div className="container">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        logout={logout}
        chats={history}
        loadChat={loadChat}
        setChat={setChat}
        setView={setView}
        setIsNewChat={setIsNewChat}
        clearHistory={clearHistory}
        deleteHistory={deleteHistory}
        renameHistory={renameHistory}
        togglePinHistory={togglePinHistory}
      />

      <Header />

      <button
          className="menu-btn"
          onClick={() => {
              if (sidebarOpen) {
                  setSidebarOpen(false);
              } else {
                  setSidebarOpen(true);
              }
          }}>
          ☰
      </button>

      {view === "home" && (
  <>
    {/* ORB */}
    <div className={`circle ${
        status === "Listening..."
          ? "listening"
          : status === "Thinking... "
          ? "thinking"
          : status === "Speaking..."
          ? "speaking"
          : ""
      }`}>
        <div className="ring ring1"></div>
        <div className="ring ring2"></div>
        <div className="core"></div>
      </div>

      <h1 className="title">NOVA AI</h1>

      {/* ONLY ONE STATUS */}
      <p className="status-text">
        {status}
      </p>

      {/* SOUND WAVE ONLY HERE */}
      <div className={`sound-wave ${
        status !== "Ready" && status !== "Error"
          ? "active"
          : ""
      }`}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </>
  )}

      {/* CHAT */}

      <div className={`chat-box ${view === "chat" ? "full" : ""}`}
        onClick={() => {
          if (chat.length > 0 && view === "home") {
            setView("chat");
          }
        }}
        onDoubleClick={()=>{
          if(view==="chat"){
            setView("home");
          }
        }}
      >

        {chat.length === 0 && view === "home" && (
          <p className="subtitle">
            Start talking with NOVA...
          </p>
        )}

        

        {displayChats.map((msg, i) => (
          <div className="chat-item" key={i}>
            <div className="user-msg">
              {msg.message}
            </div>

            <div className="ai-msg">
              {msg.reply}
            </div>
          </div>
        ))}

        <div ref={chatEndRef}></div>

      </div>

      <div
        className={`chat-input-container ${
          view === "chat" ? "full" : ""
        }`}
      >

        <input
          type="text"
          className="chat-input"
          placeholder="Message NOVA AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && input.trim()) {
              await sendMessage(input);
              setInput("");
            }
          }}
        />

        <button
          className="send-btn"
          onClick={async () => {
            if (!input.trim()) return;

            await sendMessage(input);

            setInput("");
          }}
        >
          ➤
        </button>

      <VoiceButton
        setStatus={setStatus}
        sendMessage={(text) => sendMessage(text, true)}
      />
      </div>


    </div>
    
  );
}

export default MainLayout;
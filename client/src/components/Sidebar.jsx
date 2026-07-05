import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaCog,
  FaPen,
  FaTrash,FaSearch,FaThumbtack
} from "react-icons/fa";

function Sidebar({
      open,
      setOpen,
      logout,
      chats = [],
      loadChat,
      setChat,
      setView,
      setIsNewChat,
      clearHistory,
      renameHistory,
      deleteHistory,
      togglePinHistory
    }) 
  {

    const navigate = useNavigate();
    const [editingId, setEditingId] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [activeChatId, setActiveChatId] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    useEffect(() => {
      if (!open) {
        setMenuOpenId(null);
      }
    }, [open]);
    
      const [search, setSearch] = useState("");
       
      const filteredChats = chats.filter((chat) =>
        chat.title.toLowerCase().includes(search.toLowerCase())
      );

    return (<>
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      ></div>

      <div className={`sidebar ${open ? "open" : ""}`}>

        <h2 className="sidebar-title">NOVA AI</h2>

        <button
          className="new-chat-btn"
          onClick={() => {
            setChat([]);
            setView("home");
            setIsNewChat(true);
            setOpen(false);
          }}
        >
          New Chat
        </button>

        <div className="history">

          <p className="history-title">
            Recent Chats
          </p>

          <div className="history-search">

          <FaSearch className="history-search-icon"/>

          <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
          />

      </div>

          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  className={`history-item ${
                    activeChatId === chat._id ? "active-history" : ""
                  }`}
                  onClick={() => {
                    loadChat(chat);
                    setActiveChatId(chat._id);
                  }}
                >
                  {
                    editingId === chat._id ? (

                    <input
                      className="rename-input"
                      value={newTitle}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setNewTitle(e.target.value)}

                      onKeyDown={async (e) => {

                        if (e.key === "Enter") {

                          await renameHistory(chat._id, newTitle);

                          setEditingId(null);

                        }

                        if (e.key === "Escape") {

                          setEditingId(null);

                        }

                      }}

                      onBlur={async () => {

                        await renameHistory(chat._id, newTitle);

                        setEditingId(null);

                      }}
                    />

                    ) : (

                    <span className="history-name">
                      {chat.pinned && (
                        <FaThumbtack
                          style={{
                            marginRight: "8px",
                            color: "#FFD54F",
                            fontSize: "12px"
                          }}
                        />
                      )}
                      {chat.title}
                    </span>

                    )
                    }

                  {activeChatId === chat._id && (
                    <>
                    <button
                    className="history-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      setMenuOpenId(
                        menuOpenId === chat._id ? null : chat._id
                      );
                    }}
                  >
                    ⋮
                  </button>
                  {menuOpenId === chat._id && (
                      <div className="history-menu">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();

                            await togglePinHistory(chat._id);

                            setTimeout(() => {
                              setMenuOpenId(null);
                            }, 100);
                          }}
                        >
                          <FaThumbtack />
                          <span>
                            {chat.pinned ? "Unpin" : "Pin"}
                          </span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(chat._id);
                            setNewTitle(chat.title);
                            setMenuOpenId(null);
                          }}
                        >
                          <FaPen />
                          <span>Rename</span>
                        </button>

                        <button
                          onClick={async (e) => {

                              e.stopPropagation();

                              const confirmDelete = window.confirm(
                                  "Delete this chat?"
                              );

                              if (!confirmDelete) return;

                              await deleteHistory(chat._id);
                              setActiveChatId(null);
                              setMenuOpenId(null);

                          }}
                        >
                          <FaTrash />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </>
                  )}
                </div>
              ))
            ) : (
            <div className="history-item">
              No chats yet
            </div>
          )}

        </div>

        <div className="sidebar-bottom">

          <button
            className="side-btn"
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}>
            <FaCog />
            <span>Settings</span>
          </button>

          <button
            className="side-btn logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>
    </>
  );
}

export default Sidebar;
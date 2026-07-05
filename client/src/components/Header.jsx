import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  return (
    <header className="header">
    </header>
  );
}

export default Header;
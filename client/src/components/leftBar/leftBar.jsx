import "./leftbar.scss";
import Friends from "../../assets/friend.png";
import Home from "../../assets/images.png";
import Settings from "../../assets/settings.png";
import Logout from "../../assets/logout.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LeftBar = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8800/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      navigate("/login"); // Weiterleitung nach dem Logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="leftBar">
      <div className="container">
        <Link to={`/profile/${currentUser.id}`} className="user">
          <img
            src={
              currentUser?.profile_picture?.startsWith("http")
                ? currentUser.profile_picture
                : currentUser?.profile_picture
                ? "http://localhost:8800" + currentUser.profile_picture
                : "/images/placeholder.jpg"
            }
            alt="Profile"
          />

          <span>{currentUser.username}</span>
        </Link>
        <Link to="/friends" className="item">
          <img src={Friends} alt="" />
          <span>Friends</span>
        </Link>
        <Link to="/home" className="item">
          <img src={Home} alt="" />
          <span>Home</span>
        </Link>

        <div className="settings">
          <div className="item">
            <img src={Settings} alt="" />
            <span>Settings</span>
          </div>
        </div>
        <div
          className="item"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <img src={Logout} alt="Logout" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;

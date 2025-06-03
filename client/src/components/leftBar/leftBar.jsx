import "./leftbar.scss";
import Friends from "../../assets/friend.png";
import Home from "../../assets/images.png";
import Settings from "../../assets/settings.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <Link to={`/profile/${currentUser.id}`} className="user">
          <img src={currentUser.profile_picture} alt="" />
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
      </div>
    </div>
  );
};

export default LeftBar;
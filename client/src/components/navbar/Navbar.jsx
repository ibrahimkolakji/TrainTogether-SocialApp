import React from "react";
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import './Navbar.scss';
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span>TrainTogether</span> 
        </Link>
        <div className="search">
          <SearchRoundedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <NotificationsActiveRoundedIcon />
        <div className="user">
          <img src={currentUser.profile_picture} alt="Profile" />
          <span>{currentUser.username}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
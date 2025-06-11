import React, { useContext, useState } from "react";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom"; // Add this import

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate(); // useNavigate hook for redirect

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const res = await makeRequest.get(`/users/search?query=${value}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleSelectUser = (userId) => {
    // Clear search field and results
    setSearchTerm("");
    setResults([]);

    // Navigate to user profile
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <span>TrainTogether</span>
        </Link>
        <div className="search">
          <SearchRoundedIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {results.length > 0 && (
            <div className="search-results">
              {results.map((friend) => (
                <div
                  key={friend.id}
                  className="search-result"
                  onClick={() => handleSelectUser(friend.id)}
                >
                  <img
                    src={
                      friend.profile_picture?.startsWith("http")
                        ? friend.profile_picture
                        : friend.profile_picture
                        ? "http://localhost:8800" + friend.profile_picture
                        : "/images/placeholder.jpg"
                    }
                    alt=""
                  />
                  <span>{friend.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="right">
        
        <Link to="/notifications" className="item">
          <NotificationsActiveRoundedIcon />
        </Link>
        <div className="user">
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;

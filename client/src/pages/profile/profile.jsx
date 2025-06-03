import "./profile.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import Posts from "../../components/posts/posts";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <img
          src={currentUser.profile_picture || "https://via.placeholder.com/150"}
          alt="Profile"
          className="profile-picture"
        />
        <h1 className="profile-username">{currentUser.username}</h1>
        <button
          className={`follow-btn ${isFollowing ? "following" : ""}`}
          onClick={handleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
      <div className="profile-details">
        <h2>About Me</h2>
        <p>{currentUser.bio || "No bio available."}</p>
        <h2>Contact</h2>
        <p>Email: {currentUser.email || "Not provided"}</p>
      </div>
      <div className="profile-posts">
        <h2>My Posts</h2>
        <Posts userId={currentUser.id} /> {/* Pass the userId to filter posts */}
      </div>
    </div>
  );
};

export default Profile;
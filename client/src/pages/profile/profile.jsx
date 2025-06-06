import "./profile.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import Posts from "../../components/posts/posts";
import { makeRequest } from "../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
const Profile = () => {
  const userId = useLocation().pathname.split("/")[2];

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;
  if (!data) return <div>User not found</div>;

  return (
    <div className="profile">
      <div className="profile-header">
        <img
          src={
            data.profile_picture?.startsWith("http")
              ? data.profile_picture
              : "/images/placeholder.jpg"
          }
          alt="Profile"
          className="profile-picture"
        />
        <h1 className="profile-username">{data.username}</h1>
        <button className="follow-btn">Follow</button>
      </div>
      <div className="profile-details">
        <h2>About Me</h2>
        <p>{data.bio || "No bio available."}</p>
        <h2>Contact</h2>
        <p>Email: {data.email || "Not provided"}</p>
      </div>
      <div className="profile-posts">
        <h2>My Posts</h2>
        <Posts userId={userId} />
      </div>
    </div>
  );
};
export default Profile;
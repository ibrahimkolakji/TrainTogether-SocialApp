import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./friends.scss";
import { AuthContext } from "../../context/authContext";

const Friends = () => {
  const { currentUser } = useContext(AuthContext);

  const { data, isLoading, error } = useQuery({
    queryKey: ["friends", currentUser.id], // Include userId in the query key
    queryFn: () =>
      makeRequest.get(`/friends/${currentUser.id}`).then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading friends</div>;

  return (
    <div className="friends">
      <h2>Friends</h2>
      <div className="friends-list">
        {data && data.length > 0 ? (
          data.map((friend) => (
            <div className="friend" key={friend.id}>
             <img
  src={
    friend?.profile_picture?.startsWith("http")
      ? friend.profile_picture
      : friend?.profile_picture
      ? "http://localhost:8800" + friend.profile_picture
      : "/images/placeholder.jpg"
  }
  alt="Profile"
/>


              <span>{friend.username}</span>
            </div>
          ))
        ) : (
          <div>No friends found.</div>
        )}
      </div>
    </div>
  );
};

export default Friends;

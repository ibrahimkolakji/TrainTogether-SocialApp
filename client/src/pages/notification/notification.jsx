// src/pages/notifications/Notifications.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./notification.scss";

const Notifications = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => makeRequest.get("/notifications").then((res) => res.data),
  });

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      {isLoading
        ? "Loading..."
        : data.length === 0
        ? "No notifications yet."
        : data.map((n) => (
            <div className="notification" key={n.id}>
              <img
                src={
                  n.profile_picture?.startsWith("http")
                    ? n.profile_picture
                    : "http://localhost:8800" + n.profile_picture
                }
                alt="pfp"
              />
              <span>
                {n.type === "like" ? (
                  <>
                    <strong>{n.username}</strong> ist Dabei für: 
                  </>
                ) : (
                  <>
                    <strong>{n.username}</strong> commented:{" "}
                    <em>{n.comment_text} on</em>
                  </>
                )}
              </span>

              <div className="post-preview">
                {n.image && (
                  <img
                    src={
                      n.image.startsWith("http")
                        ? n.image
                        : "http://localhost:8800" + n.image
                    }
                    alt="post preview"
                  />
                )}
                <p>
                  <p>
                    {n.post_description?.length > 100
                      ? n.post_description.slice(0, 100) + "..."
                      : n.post_description}
                  </p>
                </p>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Notifications;

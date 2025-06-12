import "./rightBar.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";

const RightBar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Suggestions (Follow)
  const {
    data: suggestions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () =>
      makeRequest.get("/users/suggestions").then((res) => res.data ?? []),
  });

  // Notifications
  const {
    data: notifications,
    isLoading: loadingNotifications,
    isError: errorNotifications,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      makeRequest.get("/notifications").then((res) => res.data ?? []),
  });

  const followMutation = useMutation({
    mutationFn: (userId) => makeRequest.post("/relationships", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });

  const handleFollow = (userId) => {
    followMutation.mutate(userId);
  };

  const goToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="rightBar">
      <div className="container">
        {/* Suggestions */}
        <div className="item">
          <span>Suggestions for you</span>
          {isLoading ? (
            "Loading..."
          ) : isError ? (
            <p>Error loading suggestions: {error.message}</p>
          ) : (
            suggestions.map((user) => (
              <div className="user" key={user.id}>
                <div
                  className="userInfo"
                  onClick={() => goToProfile(user.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={
                      user.profile_picture?.startsWith("http")
                        ? user.profile_picture
                        : "http://localhost:8800" + user.profile_picture
                    }
                    alt={user.username}
                  />
                  <span>{user.username}</span>
                </div>
                <div className="buttons">
                  <button onClick={() => handleFollow(user.id)}>Follow</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notifications instead of latest activities */}
        <div className="item">
          <span>Notifications</span>
          {loadingNotifications ? (
            "Loading..."
          ) : errorNotifications ? (
            <p>Error loading notifications</p>
          ) : notifications.length === 0 ? (
            <p>No notifications yet.</p>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <div className="user" key={n.id}>
                <div className="userInfo">
                  <img
                    src={
                      n.profile_picture?.startsWith("http")
                        ? n.profile_picture
                        : "http://localhost:8800" + n.profile_picture
                    }
                    alt={n.username}
                  />
                  <p>
                    {n.type === "like" ? (
                      <>
                        <strong>{n.username}</strong> ist Dabei
                      </>
                    ) : (
                      <>
                        <strong>{n.username}</strong> commented:{" "}
                        <em>{n.comment_text}</em>
                      </>
                    )}
                  </p>
                </div>
                <span className="time">
                  {new Date(n.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </div>

    
      </div>
    </div>
  );
};

export default RightBar;

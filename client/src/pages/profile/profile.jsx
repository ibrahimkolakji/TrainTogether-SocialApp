import "./profile.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import Posts from "../../components/posts/posts";
import { makeRequest } from "../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const userId = useLocation().pathname.split("/")[2];
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => res.data),
  });

  const { data: relationshipData } = useQuery({
    queryKey: ["relationshipStatus", currentUser.id, userId],
    queryFn: () =>
      makeRequest
        .get(
          `/relationships?followerUserId=${currentUser.id}&followedUserId=${userId}`
        )
        .then((res) => res.data),
    enabled: !!currentUser?.id && !!userId,
  });

  const isFollowing = relationshipData?.length > 0;
  const isOwnProfile = parseInt(currentUser.id) === parseInt(userId);

  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const updateMutation = useMutation({
    mutationFn: () =>
      makeRequest.put("/users/update", {
        bio,
        profile_picture: profilePic,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", userId]);
      setCurrentUser((prev) => ({
        ...prev,
        profile_picture: profilePic,
        bio: bio,
      }));
      setEditMode(false);
    },
  });

  const followMutation = useMutation({
    mutationFn: () => makeRequest.post("/relationships", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "relationshipStatus",
        currentUser.id,
        userId,
      ]);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => makeRequest.delete("/relationships?userId=" + userId),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "relationshipStatus",
        currentUser.id,
        userId,
      ]);
    },
  });

  const handleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const handleEdit = () => {
    setBio(data.bio || "");
    setProfilePic(data.profile_picture || "");
    setEditMode(true);
  };

  const handleSave = () => {
    updateMutation.mutate();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;
  if (!data) return <div>User not found</div>;

  return (
    <div className="profile">
      <div className="profile-header">
        {editMode ? (
          <div className="upload-wrapper">
            <label htmlFor="file-upload" className="upload-label">
              <img
                src={
                  profilePic
                    ? profilePic.startsWith("http")
                      ? profilePic
                      : "http://localhost:8800" + profilePic
                    : data.profile_picture?.startsWith("http")
                    ? data.profile_picture
                    : data.profile_picture
                    ? "http://localhost:8800" + data.profile_picture
                    : "/images/placeholder.jpg"
                }
                alt="Profile Preview"
                className="upload-preview"
              />
              <div className="upload-overlay">Change Photo</div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                try {
                  const res = await makeRequest.post(
                    "/users/upload",
                    formData,
                    {
                      headers: { "Content-Type": "multipart/form-data" },
                    }
                  );
                  setProfilePic(res.data.profile_picture);
                } catch (err) {
                  console.error("Image upload failed:", err);
                }
              }}
              style={{ display: "none" }}
            />
          </div>
        ) : (
          <img
            src={
              data.profile_picture?.startsWith("http")
                ? data.profile_picture
                : data.profile_picture
                ? "http://localhost:8800" + data.profile_picture
                : "/images/placeholder.jpg"
            }
            alt="Profile"
            className="profile-picture"
          />
        )}

        <h1 className="profile-username">{data.username}</h1>

        {isOwnProfile ? (
          editMode ? (
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          )
        ) : (
          <button className="follow-btn" onClick={handleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div className="profile-details">
        <h2>About Me</h2>
        {editMode && isOwnProfile ? (
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        ) : (
          <p>{data.bio || "No bio available."}</p>
        )}

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

import "./post.scss";
import SportsGymnasticsOutlinedIcon from "@mui/icons-material/SportsGymnasticsOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/comments";
import { useState, useContext } from "react";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for dropdown menu visibility
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ["dabeiButton", post.id],
    queryFn: () =>
      makeRequest.get("/dabeiButton?postId=" + post.id).then((res) => res.data),
  });

  // Sicher prüfen ob der aktuelle Nutzer geliked hat
  const liked = Array.isArray(data) && data.includes(currentUser.id);

  const sportEmoji = {
    Running: "🏃‍♂️",
    Cycling: "🚴‍♀️",
    Swimming: "🏊‍♂️",
    Gym: "🏋️‍♂️",
    Yoga: "🧘‍♀️",
    Basketball: "🏀",
    Soccer: "⚽",
    Tennis: "🎾",
    Default: "🏅",
  };

  const mutation = useMutation({
    mutationFn: (like) => {
      if (like) return makeRequest.delete("/dabeiButton?postId=" + post.id);
      return makeRequest.post("/dabeiButton", { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dabeiButton", post.id] });
    },
  });
  const handleLike = () => {
    mutation.mutate(liked);
  };

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["commentsCount", post.id],
    queryFn: () =>
      makeRequest.get(`/comments?postId=${post.id}`).then((res) => res.data),
  });

  const commentsCount = commentsData ? commentsData.length : 0;

  const deleteMutation = useMutation({
    mutationFn: () => makeRequest.delete(`/posts/${post.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setShowModal(false); // Close modal after deletion
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <img
            src={
              post.profile_picture?.startsWith("http")
                ? post.profile_picture
                : post.profile_picture
                ? "http://localhost:8800" + post.profile_picture
                : "/images/placeholder.jpg"
            }
            alt="User"
            className="profile-picture"
          />
          <div className="details">
            <Link
              to={`/profile/${post.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span className="name">{post.username}</span>
            </Link>
            <span className="date">{moment(post.created_at).fromNow()}</span>
          </div>
          <MoreHorizIcon
            className="dots"
            onClick={() => setMenuOpen(!menuOpen)} // Toggle menu visibility
          />
          {menuOpen && (
            <div className="menu">
              <span onClick={() => setShowModal(true)}>Delete</span>
            </div>
          )}
        </div>

        <div className="content">
          <div className="sport-tag">
            <span>{sportEmoji[post.sport_type] || sportEmoji.Default}</span>
            <span className="sport-type">{post.sport_type}</span>
          </div>
          <p className="description">{post.description}</p>

          {post.image && (
            <img
              className="post-image"
              src={
                post.image.startsWith("http")
                  ? post.image
                  : "http://localhost:8800" + post.image
              }
              alt="Post media"
            />
          )}
        </div>

        <div className="info">
          <div className="item">
            {liked ? (
              <SportsGymnasticsOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <HotelOutlinedIcon onClick={handleLike} />
            )}
            {!isLoading && data ? `${data.length} Dabei` : "Loading Likes..."}
          </div>

          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            <span>
              {commentsLoading ? "Loading..." : `${commentsCount} Comments`}
            </span>
          </div>

          <div className="item">
            <ShareOutlinedIcon />
            <span>Share</span>
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} />}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Are you sure you want to delete this post?</p>
              <button onClick={handleDelete}>Yes</button>
              <button onClick={() => setShowModal(false)}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;

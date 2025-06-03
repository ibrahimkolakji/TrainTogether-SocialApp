import "./post.scss";
import SportsGymnasticsOutlinedIcon from '@mui/icons-material/SportsGymnasticsOutlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
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
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["dabeiButton", post.id],
    queryFn: () =>
      makeRequest
        .get("/dabeiButton?postId=" + post.id)
        .then((res) => res.data),
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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (like) =>{
        if (like) return makeRequest.delete("/dabeiButton?postId="+post.id);
         return makeRequest.post("/dabeiButton", {postId:post.id});
    },
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["dabeiButton", post.id] });
},
  });
  const handleLike = () => {
    mutation.mutate(liked)
  }

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["commentsCount", post.id],
    queryFn: () =>
      makeRequest.get(`/comments?postId=${post.id}`).then((res) => res.data),
  });

  const commentsCount = commentsData ? commentsData.length : 0;

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <img
            src={post.profile_picture || "/default-profile.png"}
            alt="Profile"
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
          <MoreHorizIcon className="dots" />
        </div>

        <div className="content">
          <div className="sport-tag">
            <span>{sportEmoji[post.sport_type] || sportEmoji.Default}</span>
            <span className="sport-type">{post.sport_type}</span>
          </div>
          <h3 className="title">{post.title}</h3>
          <p className="description">{post.description}</p>
        </div>

        <div className="info">
          <div className="item">
            {liked ? (
              <SportsGymnasticsOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
            ) : (
              <HotelOutlinedIcon onClick={handleLike}  />
            )}
            {!isLoading && data
              ? `${data.length} Dabei`
              : "Loading Likes..."}
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
      </div>
    </div>
  );
};

export default Post;

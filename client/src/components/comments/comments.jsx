import { useContext } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment"; // Ensure you have moment.js installed
import { useState } from "react";

const Comments = ({ postId }) => {
  const [comment, setComment] = useState("");
  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId], // Include postId in the query key
    queryFn: () =>
      makeRequest.get(`/comments?postId=${postId}`).then((res) => res.data),
  });

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }); // Invalidate only the specific post's comments
    },
  });

  const handleClick = (e) => {
    e.preventDefault();
    mutation.mutate({
      comment,
      postId,
    });
  };

  return (
    <div className="comments">
      <div className="write">
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
        <input
          type="text"
          placeholder="write a comment"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ? "Loading"
        : data.map((comment) => (
            <div className="comment" key={comment.id}>
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

              <div className="info">
                <span>{comment.username}</span>
                <p>{comment.comment}</p>
              </div>
              <span className="date">
                {moment(comment.created_at).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;

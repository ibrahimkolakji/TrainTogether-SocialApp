import React from "react";
import Post from "../post/post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId || "feed"], // unterscheidet zwischen Feed und Profil
    queryFn: () =>
      makeRequest
        .get(userId ? `/posts?userId=${userId}` : "/posts")
        .then((res) => res.data),
  });

  return (
    <div className="posts">
      {error
        ? "Something went wrong"
        : isLoading
        ? "Loading..."
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};
export default Posts;

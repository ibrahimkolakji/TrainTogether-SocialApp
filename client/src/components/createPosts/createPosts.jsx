import React, { useContext, useState } from "react"; 
import "./createPost.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

const CreatePosts = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sportType, setSportType] = useState("");

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const sportOptions = [
    "Running",
    "Cycling",
    "Swimming",
    "Gym",
    "Yoga",
    "Basketball",
    "Soccer",
    "Tennis",
    "Other"
  ];

  const handleClick = (e) => {
    e.preventDefault();
    mutation.mutate({
      title,
      description,
      sport_type: sportType,
      userId: currentUser.id,
    });
  }

  return (
    <div className="create-posts">
      <form className="create-post-form">
        <h2>Create a New Post</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter post title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter post description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div className="form-group">
          <label htmlFor="sportType">Sport Type</label>
          <select
            id="sportType"
            name="sportType"
            onChange={(e) => setSportType(e.target.value)}
            value={sportType}
          >
            <option value="" disabled>Select a sport type</option>
            {sportOptions.map((sport) => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-btn" onClick={handleClick}>
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePosts;

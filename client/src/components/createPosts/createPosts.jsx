import React, { useState } from "react";
import "./createPost.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { makeRequest } from "../../axios";

const CreatePosts = () => {
  const [description, setDescription] = useState("");
  const [sportType, setSportType] = useState("");
  const [file, setFile] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData) =>
      makeRequest.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setDescription("");
      setSportType("");
      setFile(null);
    },
  });

  const sportOptions = [
    "Running", "Cycling", "Swimming", "Gym", "Yoga",
    "Basketball", "Soccer", "Tennis", "Other"
  ];

  const handleClick = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("sport_type", sportType);
    if (file) formData.append("file", file);
    mutation.mutate(formData);
  };

  return (
    <div className="create-posts">
      <form className="create-post-form">
        <h2>Share an Activity</h2>

        <div className="form-group description-upload">
          <label htmlFor="description">Description</label>
          <div className="input-wrapper">
            <textarea
              id="description"
              placeholder="Let's Workout Together! 🏋️"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            <label htmlFor="file-upload" className="image-upload-btn">📎</label>
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          {file && (
            <div className="preview">
              <img src={URL.createObjectURL(file)} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="sportType">Sport Type</label>
          <select
            id="sportType"
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

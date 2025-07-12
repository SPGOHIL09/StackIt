import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const Ask = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("**Describe your question here...**");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body || tags.length === 0) {
      setError("All fields are required");
      return;
    }

    try {
      await API.post("/questions", { title, body, tags });
      navigate("/"); // Redirect to homepage
    } catch {
      setError("Failed to post question");
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        overflow: "hidden", // Prevent scrolling
        position: "fixed", // Ensure the container takes up the full viewport
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(135deg, #ff7e31 0%, #ff5722 25%, #ff9800 50%, #ffb347 75%, #ffa726 100%)",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "900px", // Increased width
          width: "100%",
          borderRadius: "20px", // Added rounded corners
          fontFamily: "Roboto, sans-serif", // Changed font style
        }}
      >
        <h3 className="text-center mb-4">Ask a Question</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              placeholder="e.g. How to center a div in CSS?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Body (Markdown supported)</label>
            <MDEditor value={body} onChange={setBody} />
          </div>

          <div className="mb-3">
            <label className="form-label">Tags</label>
            <input
              className="form-control"
              placeholder="Press Enter or comma to add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
            />
            <div className="mt-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="badge bg-secondary me-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => removeTag(tag)}
                >
                  {tag} ✕
                </span>
              ))}
            </div>
          </div>

          <button className="btn btn-primary w-100">Post Question</button>
        </form>
      </div>
    </div>
  );
};

export default Ask;
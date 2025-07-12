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
      const res = await API.post("/questions", { title, body, tags });
      navigate(`/question/${res.data._id}`);
    } catch {
      setError("Failed to post question");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h3>Ask a Question</h3>
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

        <button className="btn btn-primary">Post Question</button>
      </form>
    </div>
  );
};

export default Ask;
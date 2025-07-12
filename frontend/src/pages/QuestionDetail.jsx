import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import DOMPurify from "dompurify";
import { marked } from "marked";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  const [editAnswer, setEditAnswer] = useState(null);
  const [editedBody, setEditedBody] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedQuestionBody, setEditedQuestionBody] = useState("");
  const [editedTags, setEditedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;
    try {
      const res = await API.post("/answers", { body: newAnswer, question: id });
      setAnswers([res.data, ...answers]);
      setNewAnswer("");
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  const voteAnswer = async (answerId, type) => {
    const res = await API.put(`/answers/${answerId}/${type}`);
    setAnswers((prev) =>
      prev.map((a) =>
        a._id === answerId ? { ...a, [`${type}s`]: res.data[`${type}s`] } : a
      )
    );
  };

  const handleDeleteAnswer = async (id) => {
    if (!window.confirm("Delete this answer?")) return;
    await API.delete(`/answers/${id}`);
    setAnswers(answers.filter((a) => a._id !== id));
  };

  const handleUpdateAnswer = async () => {
    const res = await API.put(`/answers/${editAnswer._id}`, {
      body: editedBody,
    });
    setAnswers((prev) =>
      prev.map((a) => (a._id === res.data._id ? res.data : a))
    );
    setEditAnswer(null);
    setEditedBody("");
  };

  const voteQuestion = async (type) => {
    const res = await API.put(`/questions/${id}/${type}`);
    setQuestion((prev) => ({
      ...prev,
      [`${type}s`]: res.data[`${type}s`],
    }));
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Delete this question?")) return;
    await API.delete(`/questions/${id}`);
    navigate("/");
  };

  const handleUpdateQuestion = async () => {
    const res = await API.put(`/questions/${id}`, {
      title: editedTitle,
      body: editedQuestionBody,
      tags: editedTags,
    });
    setQuestion(res.data);
    setEditMode(false);
  };

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!editedTags.includes(tagInput.trim())) {
        setEditedTags([...editedTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionRes = await API.get(`/questions/${id}`);
        setQuestion(questionRes.data);
        
        const answersRes = await API.get(`/answers/question/${id}`);
        setAnswers(answersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!question) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4" data-color-mode="light">
      {/*  QUESTION BLOCK */}
      {!editMode ? (
        <>
          <h2>{question.title}</h2>
          <div
            className="mb-3"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked.parse(question.body)),
            }}
          />
          <div className="mb-3">
            {question.tags.map((tag, idx) => (
              <span key={idx} className="badge bg-secondary me-2">{tag}</span>
            ))}
          </div>
          <div className="text-muted small mb-3">
            Asked by <strong>{question.user?.username}</strong>
          </div>

          <div className="d-flex gap-2 mb-4">
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => voteQuestion("upvote")}
            >
              👍 {question.upvotes}
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => voteQuestion("downvote")}
            >
              👎 {question.downvotes}
            </button>
            {(user?.user._id === question.user?._id || user?.user.role === "admin") && (
              <>
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => {
                    setEditMode(true);
                    setEditedTitle(question.title);
                    setEditedQuestionBody(question.body);
                    setEditedTags(question.tags);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleDeleteQuestion}
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <h5>Edit Question</h5>
          <input
            className="form-control mb-2"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <MDEditor value={editedQuestionBody} onChange={setEditedQuestionBody} />
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Add tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
          />
          <div className="mt-2">
            {editedTags.map((tag, idx) => (
              <span key={idx} className="badge bg-secondary me-2">
                {tag}{" "}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setEditedTags(editedTags.filter((t) => t !== tag))
                  }
                >
                  ✕
                </span>
              </span>
            ))}
          </div>
          <button className="btn btn-success mt-2" onClick={handleUpdateQuestion}>
            Save
          </button>
          <button
            className="btn btn-secondary mt-2 ms-2"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </>
      )}

      {/*  LIST OF ANSWERS */}
      <hr />
      <h4>Answers ({answers.length})</h4>
      {answers.map((a) => (
        <div className="card p-3 mb-3" key={a._id}>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked.parse(a.body)),
            }}
          />
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="text-muted small">Answered by {a.user?.username}</div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => voteAnswer(a._id, "upvote")}
              >
                👍 {a.upvotes}
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => voteAnswer(a._id, "downvote")}
              >
                👎 {a.downvotes}
              </button>
              {(user?.user._id === a.user._id || user?.user.role === "admin") && (
                <>
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => {
                      setEditAnswer(a);
                      setEditedBody(a.body);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteAnswer(a._id)}
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {/*  SUBMIT YOUR ANSWER FORM */}
      <hr />
      <h5 className="mt-4">Submit Your Answer</h5>
      {user ? (
        <div className="mt-2">
          <MDEditor value={newAnswer} onChange={setNewAnswer} />
          <button className="btn btn-primary mt-2" onClick={handlePostAnswer}>
            Post Answer
          </button>
        </div>
      ) : (
        <div className="alert alert-info mt-2">
          Please <strong>login</strong> to post an answer.
        </div>
      )}

      {/* EDIT ANSWER MODE */}
      {editAnswer && (
        <div className="mt-5">
          <h5>Edit Answer</h5>
          <MDEditor value={editedBody} onChange={setEditedBody} />
          <button className="btn btn-success mt-2" onClick={handleUpdateAnswer}>
            Save
          </button>
          <button
            className="btn btn-secondary mt-2 ms-2"
            onClick={() => {
              setEditAnswer(null);
              setEditedBody("");
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { format } from "date-fns";
import "../styles/questionDetail.css"; // Ensure this still exists for custom styles

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  const [editAnswer, setEditAnswer] = useState(null); // Answer being edited
  const [editedBody, setEditedBody] = useState(""); // Body of the answer being edited

  const [editMode, setEditMode] = useState(false); // Question edit mode
  const [editedTitle, setEditedTitle] = useState("");
  const [editedQuestionBody, setEditedQuestionBody] = useState("");
  const [editedTags, setEditedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest', 'oldest', 'votes'

  // --- Utility Functions ---
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const sanitizeAndMark = (markdown) => {
    return DOMPurify.sanitize(marked.parse(markdown));
  };

  // --- API Handlers ---
  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;
    try {
      const res = await API.post("/answers", { body: newAnswer, question: id });
      setAnswers((prev) => [res.data, ...prev]); // Add new answer to top
      setNewAnswer("");
    } catch (error) {
      console.error("Error posting answer:", error);
      alert("Failed to post answer. Please try again.");
    }
  };

  const voteAnswer = async (answerId, type) => {
    try {
      const res = await API.put(`/answers/${answerId}/${type}`);
      setAnswers((prev) =>
        prev.map((a) =>
          a._id === answerId ? { ...a, [`${type}s`]: res.data[`${type}s`] } : a
        )
      );
    } catch (error) {
      console.error(`Error voting ${type} on answer:`, error);
      alert("Failed to record vote. Please try again.");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      await API.delete(`/answers/${answerId}`);
      setAnswers((prev) => prev.filter((a) => a._id !== answerId));
    } catch (error) {
      console.error("Error deleting answer:", error);
      alert("Failed to delete answer. Please try again.");
    }
  };

  const handleUpdateAnswer = async () => {
    if (!editedBody.trim() || !editAnswer) return;
    try {
      const res = await API.put(`/answers/${editAnswer._id}`, {
        body: editedBody,
      });
      setAnswers((prev) =>
        prev.map((a) => (a._id === res.data._id ? res.data : a))
      );
      setEditAnswer(null); // Close modal
      setEditedBody("");
    } catch (error) {
      console.error("Error updating answer:", error);
      alert("Failed to update answer. Please try again.");
    }
  };

  const voteQuestion = async (type) => {
    try {
      const res = await API.put(`/questions/${id}/${type}`);
      setQuestion((prev) => ({
        ...prev,
        [`${type}s`]: res.data[`${type}s`],
      }));
    } catch (error) {
      console.error(`Error voting ${type} on question:`, error);
      alert("Failed to record vote. Please try again.");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) return;
    try {
      await API.delete(`/questions/${id}`);
      navigate("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question. Please try again.");
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editedTitle.trim() || !editedQuestionBody.trim()) {
      alert("Title and body cannot be empty.");
      return;
    }
    try {
      const res = await API.put(`/questions/${id}`, {
        title: editedTitle,
        body: editedQuestionBody,
        tags: editedTags,
      });
      setQuestion(res.data);
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question. Please try again.");
    }
  };

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase(); // Normalize tags
      if (!editedTags.includes(newTag)) {
        setEditedTags([...editedTags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setEditedTags(editedTags.filter((tag) => tag !== tagToRemove));
  };

  // --- Sorting Answers ---
  const sortedAnswers = [...answers].sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOrder === "votes") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    return 0;
  });

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [questionRes, answersRes] = await Promise.all([
          API.get(`/questions/${id}`),
          API.get(`/answers/question/${id}`),
        ]);
        setQuestion(questionRes.data);
        setAnswers(answersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setQuestion(null); // Indicate question not found/error
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fs-5 text-muted">Fetching question details...</p>
      </div>
    );
  }

  // --- Question Not Found State ---
  if (!question) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning shadow-sm p-4" role="alert">
          <h4 className="alert-heading">Question Not Found!</h4>
          <p>The question you're looking for might have been moved, deleted, or doesn't exist.</p>
          <hr />
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            <i className="bi bi-arrow-left me-2"></i> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #ff7e31 0%, #ff5722 25%, #ff9800 50%, #ffb347 75%, #ffa726 100%)",
      }}
    >
      <div className="container py-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Question Detail
            </li>
          </ol>
        </nav>

        {/* --- QUESTION BLOCK --- */}
        <div className="card shadow-lg mb-5 border-0 rounded-3">
          {!editMode ? (
            <div className="card-body p-5">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <h1 className="card-title display-6 fw-bold text-primary mb-0">{question.title}</h1>
                <div className="d-flex align-items-center">
                  <span className="badge bg-info text-dark fs-6 me-2 py-2 px-3 rounded-pill">
                    <i className="bi bi-chat-dots me-1"></i> {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                  </span>
                  <span className="badge bg-secondary fs-6 py-2 px-3 rounded-pill">
                    <i className="bi bi-eye me-1"></i> {question.views || 0} {question.views === 1 ? 'View' : 'Views'}
                  </span>
                </div>
              </div>

              <div className="d-flex flex-wrap mb-4 gap-2">
                {question.tags.map((tag, idx) => (
                  <span key={idx} className="badge bg-light text-muted border border-secondary px-3 py-2 rounded-pill fs-7">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="card border-0 bg-light-subtle p-4 rounded-3 mb-4">
                <div className="card-body p-0 markdown-content fs-5" dangerouslySetInnerHTML={{ __html: sanitizeAndMark(question.body) }} />
              </div>

              <div className="d-flex justify-content-between align-items-center flex-wrap mt-5 pt-3 border-top">
                <div className="text-muted small">
                  Asked by{" "}
                  <strong className="text-primary">{question.user?.username || "Anonymous"}</strong>
                  {question.createdAt && (
                    <> on <span className="fw-semibold">{formatDate(question.createdAt)}</span></>
                  )}
                </div>
                <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                  <div className="btn-group shadow-sm" role="group">
                    <button
                      className="btn btn-outline-success d-flex align-items-center px-3 py-2"
                      onClick={() => voteQuestion("upvote")}
                    >
                      <i className="bi bi-hand-thumbs-up me-2"></i> {question.upvotes || 0}
                    </button>
                    <button
                      className="btn btn-outline-danger d-flex align-items-center px-3 py-2"
                      onClick={() => voteQuestion("downvote")}
                    >
                      <i className="bi bi-hand-thumbs-down me-2"></i> {question.downvotes || 0}
                    </button>
                  </div>

                  {(user?.user._id === question.user?._id || user?.user.role === "admin") && (
                    <div className="btn-group shadow-sm" role="group">
                      <button
                        className="btn btn-outline-primary d-flex align-items-center px-3 py-2"
                        onClick={() => {
                          setEditMode(true);
                          setEditedTitle(question.title);
                          setEditedQuestionBody(question.body);
                          setEditedTags(question.tags);
                        }}
                      >
                        <i className="bi bi-pencil-square me-2"></i> Edit
                      </button>
                      <button
                        className="btn btn-outline-danger d-flex align-items-center px-3 py-2"
                        onClick={handleDeleteQuestion}
                      >
                        <i className="bi bi-trash me-2"></i> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card-body p-5">
              <h3 className="card-title fw-bold text-primary mb-4">Edit Question</h3>
              <div className="mb-4">
                <label htmlFor="editedQuestionTitle" className="form-label fw-semibold">Question Title</label>
                <input
                  id="editedQuestionTitle"
                  className="form-control form-control-lg"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Enter question title"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editedQuestionBody" className="form-label fw-semibold">Question Body</label>
                <MDEditor
                  id="editedQuestionBody"
                  value={editedQuestionBody}
                  onChange={setEditedQuestionBody}
                  preview="edit"
                  height={300}
                  className="rounded-3"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="questionTagsInput" className="form-label fw-semibold">Tags</label>
                <input
                  id="questionTagsInput"
                  type="text"
                  className="form-control"
                  placeholder="Add tag and press Enter or comma"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                />
                <small className="form-text text-muted mt-2 d-block">Separate tags with Enter or comma.</small>
                <div className="d-flex flex-wrap mt-2 gap-2">
                  {editedTags.map((tag, idx) => (
                    <span key={idx} className="badge bg-primary text-white py-2 px-3 rounded-pill d-flex align-items-center">
                      {tag}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        aria-label="Remove tag"
                        onClick={() => removeTag(tag)}
                      ></button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="d-flex gap-3 mt-4">
                <button className="btn btn-primary btn-lg shadow-sm" onClick={handleUpdateQuestion}>
                  <i className="bi bi-save me-2"></i> Save Changes
                </button>
                <button className="btn btn-outline-secondary btn-lg" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- ANSWERS SECTION --- */}
        <div className="card shadow-lg mb-5 border-0 rounded-3">
          <div className="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
            <h3 className="mb-0 fw-bold text-dark">{answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}</h3>
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Sort by: {sortOrder === "newest" ? "Newest" : sortOrder === "oldest" ? "Oldest" : "Highest Votes"}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="sortDropdown">
                <li><button className="dropdown-item" onClick={() => setSortOrder("newest")}>Newest</button></li>
                <li><button className="dropdown-item" onClick={() => setSortOrder("oldest")}>Oldest</button></li>
                <li><button className="dropdown-item" onClick={() => setSortOrder("votes")}>Highest Votes</button></li>
              </ul>
            </div>
          </div>
          <div className="card-body p-0">
            {sortedAnswers.length === 0 ? (
              <div className="text-center p-5">
                <p className="lead text-muted mb-0">No answers yet. Be the first to share your knowledge!</p>
                {user && (
                    <p className="text-muted mt-2">Use the "Your Answer" section below to contribute.</p>
                )}
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {sortedAnswers.map((a, index) => (
                  <div
                    className={`list-group-item p-4 ${index % 2 === 0 ? 'bg-light' : 'bg-white'}`}
                    key={a._id}
                  >
                    <div className="d-flex flex-column flex-md-row">
                      {/* Vote Controls */}
                      <div className="d-flex flex-row flex-md-column align-items-center me-md-4 mb-3 mb-md-0">
                        <button className="btn btn-outline-success btn-sm mb-1" onClick={() => voteAnswer(a._id, "upvote")}>
                          <i className="bi bi-caret-up-fill fs-5"></i>
                        </button>
                        <span className="fw-bold fs-5 mx-2 mx-md-0">{a.upvotes - a.downvotes}</span>
                        <button className="btn btn-outline-danger btn-sm mt-1" onClick={() => voteAnswer(a._id, "downvote")}>
                          <i className="bi bi-caret-down-fill fs-5"></i>
                        </button>
                      </div>

                      {/* Answer Body and Actions */}
                      <div className="flex-grow-1">
                        <div className="markdown-content fs-5 mb-3" dangerouslySetInnerHTML={{ __html: sanitizeAndMark(a.body) }} />
                        <div className="d-flex justify-content-between align-items-end flex-wrap mt-3 pt-2 border-top">
                          <div className="d-flex gap-2">
                            {(user?.user._id === a.user._id || user?.user.role === "admin") && (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => { setEditAnswer(a); setEditedBody(a.body); }}
                                  data-bs-toggle="modal"
                                  data-bs-target="#editAnswerModal"
                                >
                                  <i className="bi bi-pencil-square me-1"></i> Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteAnswer(a._id)}
                                >
                                  <i className="bi bi-trash me-1"></i> Delete
                                </button>
                              </>
                            )}
                          </div>
                          <div className="text-muted small text-end mt-2 mt-md-0">
                            <div>Answered by{" "}
                              <strong className="text-info">{a.user?.username || "Anonymous"}</strong>
                              {/* Assuming user has an avatar field */}
                              {a.user?.avatar && (
                                <img
                                  src={a.user.avatar}
                                  alt={a.user.username}
                                  className="rounded-circle ms-2"
                                  style={{ width: "24px", height: "24px", objectFit: "cover" }}
                                />
                              )}
                            </div>
                            {a.createdAt && <div>{formatDate(a.createdAt)}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- SUBMIT ANSWER SECTION --- */}
        <div className="card shadow-lg border-0 rounded-3">
          <div className="card-header bg-primary text-white p-4 rounded-top-3">
            <h3 className="mb-0 fw-bold">Your Answer</h3>
          </div>
          <div className="card-body p-4">
            {user ? (
              <>
                <MDEditor
                  value={newAnswer}
                  onChange={setNewAnswer}
                  preview="edit"
                  height={250}
                  className="rounded-3 mb-3"
                />
                <button
                  className="btn btn-success btn-lg shadow-sm"
                  onClick={handlePostAnswer}
                  disabled={!newAnswer.trim()}
                >
                  <i className="bi bi-send me-2"></i> Post Your Answer
                </button>
              </>
            ) : (
              <div className="alert alert-info border-0 text-center py-4 mb-0 rounded-3" role="alert">
                <h5 className="alert-heading fw-bold">Want to share your answer?</h5>
                <p className="mb-3">Please <strong className="text-primary">login</strong> to contribute to this discussion.</p>
                <button className="btn btn-outline-primary" onClick={() => navigate("/login")}>
                  <i className="bi bi-box-arrow-in-right me-2"></i> Login Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- EDIT ANSWER MODAL (Bootstrap Modal) --- */}
        {editAnswer && (
          <div className="modal fade" id="editAnswerModal" tabIndex="-1" aria-labelledby="editAnswerModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content rounded-4 shadow-lg">
                <div className="modal-header bg-primary text-white border-0 rounded-top-4">
                  <h5 className="modal-title fw-bold" id="editAnswerModalLabel">Edit Your Answer</h5>
                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body p-4">
                  <MDEditor
                    value={editedBody}
                    onChange={setEditedBody}
                    preview="edit"
                    height={250}
                    className="rounded-3"
                  />
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => { setEditAnswer(null); setEditedBody(""); }}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdateAnswer}
                    data-bs-dismiss="modal" // Close modal on save
                    disabled={!editedBody.trim()}
                  >
                    <i className="bi bi-save me-2"></i> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
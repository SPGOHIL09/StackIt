import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const fetchQuestions = async () => {
    try {
      const res = await API.get(`/questions?page=${page}&limit=${limit}`);
      setQuestions(res.data.questions);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error loading questions", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Top Questions</h3>
        <Link to="/ask" className="btn btn-outline-primary">Ask Question</Link>
      </div>

      {questions.map((q) => (
        <div className="card mb-3 p-3" key={q._id}>
          <Link to={`/question/${q._id}`} className="text-decoration-none">
            <h5 className="text-primary">{q.title}</h5>
          </Link>
          <div className="text-muted small mb-2">
            {q.body.slice(0, 100)}...
          </div>
          <div className="d-flex justify-content-between small">
            <div>
              {q.tags.map((tag, idx) => (
                <span key={idx} className="badge bg-light text-dark border me-1">
                  {tag}
                </span>
              ))}
            </div>
            <div>
              Asked by <strong>{q.user?.username}</strong>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4 gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="align-self-center">Page {page}</span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage(page + 1)}
          disabled={page * limit >= total}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
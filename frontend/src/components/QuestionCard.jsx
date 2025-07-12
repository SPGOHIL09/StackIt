import React from "react";
import { Link } from "react-router-dom";

const QuestionCard = ({ question }) => {
  return (
    <div className="card mb-3 p-3">
      <Link to={`/question/${question._id}`}>
        <h5 className="mb-2 text-primary">{question.title}</h5>
      </Link>
      <div
        className="text-muted small mb-2"
        dangerouslySetInnerHTML={{ __html: question.body.substring(0, 120) + "..." }}
      />
      <div className="d-flex justify-content-between">
        <div>
          {question.tags.map((tag, i) => (
            <span key={i} className="badge bg-light text-dark border me-1">{tag}</span>
          ))}
        </div>
        <div className="text-end small text-muted">
          Asked by {question.user?.username || "Anonymous"}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import QuestionCard from "../components/QuestionCard";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("latest");
  const limit = 5;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          `/questions?page=${page}&limit=${limit}&search=${searchTerm}&sort=${filterBy}&unanswered=${filterBy === "unanswered"}&popular=${filterBy === "popular"}`
        );
        setQuestions(res.data.questions);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Error loading questions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [page, searchTerm, filterBy]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (filter) => {
    setFilterBy(filter);
    setPage(1);
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Where developers <span className="text-gradient">learn</span> and{" "}
              <span className="text-gradient">grow</span>
            </h1>
            <p className="hero-subtitle">
              Get answers to your technical questions, share knowledge, and connect with the developer community
            </p>
            <div className="hero-actions">
              <Link to="/ask" className="btn btn-primary btn-lg hero-btn">
                <i className="fas fa-question-circle me-2"></i>
                Ask Question
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-outline-primary btn-lg hero-btn">
                  <i className="fas fa-user-plus me-2"></i>
                  Join Community
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container main-content">
        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-container">
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          <div className="filter-tabs">
            <button
              className={`filter-btn ${filterBy === "latest" ? "active" : ""}`}
              onClick={() => handleFilterChange("latest")}
            >
              <i className="fas fa-clock me-2"></i>Latest
            </button>
            <button
              className={`filter-btn ${filterBy === "popular" ? "active" : ""}`}
              onClick={() => handleFilterChange("popular")}
            >
              <i className="fas fa-fire me-2"></i>Popular
            </button>
            <button
              className={`filter-btn ${filterBy === "unanswered" ? "active" : ""}`}
              onClick={() => handleFilterChange("unanswered")}
            >
              <i className="fas fa-question me-2"></i>Unanswered
            </button>
          </div>
        </div>

        {/* Questions Section */}
        <div className="questions-section">
          <div className="section-header">
            <h2 className="section-title">
              {filterBy === "latest" && "Latest Questions"}
              {filterBy === "popular" && "Popular Questions"}
              {filterBy === "unanswered" && "Unanswered Questions"}
            </h2>
            <div className="results-count">
              {loading ? "Loading..." : `${questions.length} of ${total} questions`}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-question-circle empty-icon"></i>
              <h3>No questions found</h3>
              <p>Be the first to ask a question!</p>
              <Link to="/ask" className="btn btn-primary">
                Ask Question
              </Link>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((q) => (
                <QuestionCard key={q._id} question={q} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="pagination-container">
              <div className="pagination-wrapper">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                  Previous
                </button>
                
                <div className="pagination-info">
                  <span className="page-indicator">
                    Page {page} of {Math.ceil(total / limit)}
                  </span>
                </div>
                
                <button
                  className="pagination-btn"
                  onClick={() => setPage(page + 1)}
                  disabled={page * limit >= total}
                >
                  Next
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .homepage-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ff7e31 0%, #ff5722 25%, #ff9800 50%, #ffb347 75%, #ffa726 100%);
        }

        .hero-section {
          padding: 100px 0;
          color: white;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .text-gradient {
          background: linear-gradient(45deg, #fff3e0, #ffffff);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hero-btn {
          padding: 0.75rem 2rem;
          font-weight: 600;
          border-radius: 50px;
          transition: all 0.3s ease;
        }

        .hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .main-content {
          background: #f8f9fa;
          border-radius: 20px 20px 0 0;
          margin-top: -50px;
          position: relative;
          z-index: 1;
          padding: 2rem;
          min-height: 70vh;
        }

        .search-filter-bar {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-container {
          flex: 1;
          min-width: 300px;
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 2px solid #e9ecef;
          border-radius: 25px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #ff5722;
          box-shadow: 0 0 0 3px rgba(255, 87, 34, 0.1);
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          background: white;
          padding: 0.25rem;
          border-radius: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 20px;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .filter-btn:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .filter-btn.active {
          background: #ff5722;
          color: white;
        }

        .questions-section {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .results-count {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .loading-container {
          text-align: center;
          padding: 3rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          color: #e9ecef;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #6c757d;
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: #adb5bd;
          margin-bottom: 2rem;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pagination-container {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e9ecef;
        }

        .pagination-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 1px solid #e9ecef;
          background: white;
          border-radius: 25px;
          font-weight: 500;
          color: #495057;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #ff5722;
          color: white;
          border-color: #ff5722;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          display: flex;
          align-items: center;
        }

        .page-indicator {
          padding: 0.5rem 1rem;
          background: #f8f9fa;
          border-radius: 15px;
          font-weight: 500;
          color: #495057;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .search-filter-bar {
            flex-direction: column;
            gap: 1rem;
          }
          
          .search-container {
            min-width: 100%;
          }
          
          .pagination-wrapper {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
import React, { useState } from "react";
import { Link } from "react-router-dom";

const QuestionCard = ({ question }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate total votes (upvotes - downvotes, but not negative)
  const totalVotes = Math.max(0, (question.upvotes || 0) - (question.downvotes || 0));
  
  // Check if question is less than a day old
  const isNewQuestion = () => {
    const questionDate = new Date(question.createdAt);
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;
    return (now - questionDate) < dayInMs;
  };
  
  // Determine popularity level and colors (simplified)
  const getPopularityData = () => {
    if (totalVotes > 15) return { level: 'Hot', color: '#ff6b6b' };
    if (totalVotes > 10) return { level: 'Trending', color: '#4ecdc4' };
    if (totalVotes > 5) return { level: 'Popular', color: '#45b7d1' };
    return null; // No badge for low vote counts
  };
  
  const popularityData = getPopularityData();
  const showNewBadge = isNewQuestion() && !popularityData;
  
  return (
    <div 
      className="position-relative mb-4"
      style={{
        borderRadius: '16px',
        background: '#ffffff',
        boxShadow: isHovered 
          ? '0 8px 25px rgba(0,0,0,0.1)' 
          : '0 4px 15px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        border: '1px solid #e9ecef'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popularity/New Badge */}
      {(popularityData || showNewBadge) && (
        <div 
          className="position-absolute top-0 end-0 px-3 py-1 text-white small fw-bold"
          style={{
            background: showNewBadge ? '#28a745' : popularityData.color,
            borderRadius: '0 16px 0 16px',
            fontSize: '0.75rem',
            letterSpacing: '0.5px'
          }}
        >
          {showNewBadge ? 'New' : popularityData.level}
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="d-flex" style={{ minHeight: '120px' }}>
        {/* Left Side - Vote Display */}
        <div 
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ 
            width: '20%',
            minWidth: '100px',
            background: '#f8f9fa',
            borderRight: '1px solid #e9ecef',
            borderRadius: '16px 0 0 16px'
          }}
        >
          {/* Vote Circle */}
          <div 
            className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
            style={{
              width: '60px',
              height: '60px',
              background: totalVotes > 10 ? '#28a745' : totalVotes > 5 ? '#ffc107' : '#6c757d',
              color: 'white',
              fontSize: '1.3rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }}
          >
            {totalVotes}
          </div>
          
          {/* Vote Label */}
          <div 
            className="mt-2 fw-medium text-muted"
            style={{ 
              fontSize: '0.8rem'
            }}
          >
            {totalVotes === 1 ? 'vote' : 'votes'}
          </div>
          
          {/* Vote Breakdown */}
          <div className="mt-1 d-flex align-items-center gap-2" style={{ fontSize: '0.7rem' }}>
            <span className="text-success">
              ▲{question.upvotes || 0}
            </span>
            <span className="text-danger">
              ▼{question.downvotes || 0}
            </span>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-grow-1 p-4 d-flex flex-column">
          {/* Question Title */}
          <Link 
            to={`/question/${question._id}`} 
            className="text-decoration-none"
          >
            <h5 
              className="mb-3 fw-bold text-dark"
              style={{ 
                fontSize: '1.1rem',
                lineHeight: '1.3',
                transition: 'color 0.2s ease'
              }}
            >
              {question.title}
            </h5>
          </Link>
          
          {/* Question Preview */}
          <div
            className="flex-grow-1 mb-3 text-muted"
            dangerouslySetInnerHTML={{ __html: question.body.substring(0, 100) + "..." }}
            style={{ 
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}
          />
          
          {/* Bottom Section */}
          <div className="d-flex justify-content-between align-items-end">
            <div className="d-flex flex-column gap-2">
              {/* Tags */}
              <div className="d-flex flex-wrap gap-1">
                {question.tags.slice(0, 3).map((tag, i) => (
                  <span 
                    key={i} 
                    className="badge bg-light text-primary"
                    style={{ 
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef'
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {question.tags.length > 3 && (
                  <span 
                    className="badge bg-light text-muted"
                    style={{ 
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '12px'
                    }}
                  >
                    +{question.tags.length - 3}
                  </span>
                )}
              </div>
              
              {/* Answer Count */}
              <div className="d-flex align-items-center">
                <span 
                  className="badge bg-success"
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '12px'
                  }}
                >
                  💬 {question.answerCount || 0} {question.answerCount === 1 ? 'answer' : 'answers'}
                </span>
              </div>
            </div>
            
            {/* Author Info */}
            <div 
              className="text-end d-flex align-items-center gap-2 text-muted"
              style={{ fontSize: '0.85rem' }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Asked by</div>
                <div className="fw-medium">{question.user?.username || "Anonymous"}</div>
              </div>
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold bg-light"
                style={{
                  width: '32px',
                  height: '32px',
                  fontSize: '0.8rem',
                  color: '#495057'
                }}
              >
                {(question.user?.username || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
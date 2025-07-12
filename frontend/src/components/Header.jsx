import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import viteLogo from "/vite.svg"; 

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img 
            src={viteLogo} 
            alt="StackIt Logo" 
            className="me-2"
            
          />
          <span 
            className="fw-bold fs-4"
            style={{
              background: 'linear-gradient(135deg, #ff5722, #ff9800)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent'
            }}
          >
            StackIt
          </span>
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto d-flex align-items-center">
            {user ? (
              <>
                <div className="nav-item d-flex align-items-center me-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, #ff5722, #ff9800)',
                      boxShadow: '0 2px 8px rgba(255,87,34,0.15)',
                      fontSize: '1.1rem'
                    }}
                  >
                    {user.user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="fw-semibold text-dark">
                    {user.user.username}
                  </span>
                </div>
                
                <Link 
                  to="/ask" 
                  className="btn btn-primary me-2 d-flex align-items-center"
                  style={{
                    background: 'linear-gradient(135deg, #ff5722, #ff9800)',
                    border: 'none',
                    borderRadius: '22px',
                    padding: '0.5rem 1.2rem',
                    boxShadow: '0 2px 8px rgba(255,87,34,0.15)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.filter = 'brightness(1.08)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.filter = 'brightness(1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-lightbulb me-1"></i>
                  Ask
                </Link>
                
                <button 
                  onClick={logout} 
                  className="btn btn-danger d-flex align-items-center"
                  style={{
                    background: 'linear-gradient(135deg, #f44336, #e91e63)',
                    border: 'none',
                    borderRadius: '22px',
                    padding: '0.5rem 1.2rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.filter = 'brightness(1.08)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.filter = 'brightness(1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn btn-outline-primary me-2 d-flex align-items-center"
                  style={{
                    borderColor: '#ff5722',
                    color: '#ff5722',
                    borderRadius: '22px',
                    padding: '0.5rem 1.2rem',
                    borderWidth: '2px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#ff5722';
                    e.target.style.color = '#fff';
                    e.target.querySelector('i').style.color = 'white'; 
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#ff5722';
                    e.target.querySelector('i').style.color = '#ff5722'; 
                  }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Link>
                
                <Link 
                  to="/register" 
                  className="btn btn-primary d-flex align-items-center"
                  style={{
                    background: 'linear-gradient(135deg, #ff5722, #ff9800)',
                    border: 'none',
                    borderRadius: '22px',
                    padding: '0.5rem 1.2rem',
                    boxShadow: '0 2px 8px rgba(255,87,34,0.15)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.filter = 'brightness(1.08)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.filter = 'brightness(1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-person-plus me-1"></i>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
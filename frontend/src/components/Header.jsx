import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-light px-4">
      <Link className="navbar-brand fw-bold" to="/">StackIt</Link>
      <div className="ms-auto">
        {user ? (
          <>
            <span className="me-3">Hi, {user.user.username}</span>
            <Link to="/ask" className="btn btn-outline-primary me-2">Ask</Link>
            <button onClick={logout} className="btn btn-outline-danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header
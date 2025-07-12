import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">StackIt</Link>
        <div className="d-flex">
          <Link to="/ask" className="btn btn-outline-primary me-2">Ask New Question</Link>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
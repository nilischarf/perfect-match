import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogoutClick() {
    onLogout();
    navigate("/login");
  }

  const activeStyle = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: isActive ? "underline" : "none",
    marginRight: "1rem"
  });

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Perfect Match
      </Link>

      {user && (
        <div className="navbar-links">
          <NavLink to="/matchmakers" style={activeStyle}>
            Matchmakers
          </NavLink>
          <NavLink to="/male-singles" style={activeStyle}>
            Male Singles
          </NavLink>
          <NavLink to="/female-singles" style={activeStyle}>
            Female Singles
          </NavLink>
          <NavLink to="/matches/new" style={activeStyle}>
            Create Match
          </NavLink>
        </div>
      )}

      <div className="navbar-auth">
        {user ? (
          <>
            <span className="navbar-username">Hi, {user.username}</span>
            <button onClick={handleLogoutClick}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" style={activeStyle}>
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavBar;

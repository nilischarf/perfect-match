// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

function HomePage({ user }) {
  return (
    <div>
      <h1>Welcome to Perfect Match</h1>
      {user ? (
        <>
          <p>
            Logged in as <strong>{user.username}</strong>.
          </p>
          <ul>
            <li>
              <Link to="/matchmakers">View all matchmakers</Link>
            </li>
            <li>
              <Link to="/male-singles">View male singles</Link>
            </li>
            <li>
              <Link to="/female-singles">View female singles</Link>
            </li>
          </ul>
        </>
      ) : (
        <p>
          Please <Link to="/login">log in</Link> to manage matchmakers and
          singles.
        </p>
      )}
    </div>
  );
}

export default HomePage;

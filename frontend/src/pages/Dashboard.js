import { apiFetch } from "../utils/api";
import { useState, useEffect } from "react";
import "../styles/Dashboard.css";

function Dashboard({ user }) {
  const [matchmakers, setMatchmakers] = useState([]);

  useEffect(() => {
    apiFetch("/matchmakers/")
      .then((data) => setMatchmakers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Welcome, {user.username}</h1>

      <h2>Matchmakers</h2>
      <ul>
        {matchmakers.map((mk) => (
          <li key={mk.id}>
            {mk.name} — {mk.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

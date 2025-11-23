import React from "react";
import "../styles/MatchmakerList.css";

function MatchmakerList({ matchmakers, onSelect }) {
  if (!matchmakers.length) {
    return <p>No matchmakers yet.</p>;
  }

  return (
    <ul>
      {matchmakers.map((mk) => (
        <li key={mk.id}>
          <button type="button" onClick={() => onSelect(mk.id)}>
            {mk.name} {mk.location ? `(${mk.location})` : ""}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default MatchmakerList;

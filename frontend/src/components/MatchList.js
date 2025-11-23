import React from "react";
import "../styles/MatchList.css";

function MatchList({ matches }) {
  if (!matches.length) return <p>No matches yet.</p>;

  return (
    <ul>
      {matches.map((m) => (
        <li key={m.id}>
          <strong>Status:</strong> {m.status || "N/A"} <br />
          <strong>Male:</strong>{" "}
          {m.male_single
            ? `${m.male_single.first_name} ${m.male_single.last_name}`
            : "N/A"}
          <br />
          <strong>Female:</strong>{" "}
          {m.female_single
            ? `${m.female_single.first_name} ${m.female_single.last_name}`
            : "N/A"}
          <br />
          {m.notes && <em>{m.notes}</em>}
        </li>
      ))}
    </ul>
  );
}

export default MatchList;

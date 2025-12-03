import React from "react";
import MatchList from "./MatchList";
import "../styles/MatchmakerDetail.css";

function MatchmakerDetail({ matchmaker }) {
  return (
    <div>
      <h1>{matchmaker.name}</h1>
      <p>Location: {matchmaker.location || "N/A"}</p>
      <p>Email: {matchmaker.email_address || "N/A"}</p>
      <p>Phone: {matchmaker.phone_number || "N/A"}</p>
      <p>Salary: {matchmaker.salary ?? "N/A"}</p>

      <h2>Matches</h2>
      <MatchList
        matches={matchmaker.matches || []}
        refresh={() => window.location.reload()}
      />
    </div>
  );
}

export default MatchmakerDetail;

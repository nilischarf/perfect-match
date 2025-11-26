import React, { useState } from "react";
import "../styles/MatchmakerList.css";
import { apiFetch } from "../utils/api";

function MatchmakerList({ matchmakers, onSelect, refresh }) {
  const [msg, setMsg] = useState("");

  async function handleDelete(id) {
    if (!window.confirm("Delete matchmaker?")) return;

    try {
      await apiFetch(`/matchmakers/${id}`, { method:"DELETE" });
      setMsg("Matchmaker removed ✔");
      refresh && refresh();
    } catch(err){
      alert(err.data?.error || "Delete failed");
    } finally{
      setTimeout(()=>setMsg(""),2000);
    }
  }

  if (!matchmakers.length) return <p>No matchmakers yet.</p>;

  return (
    <div>
      {msg && <div className="success-banner">{msg}</div>}

      <ul className="matchmaker-list">
        {matchmakers.map((mk) => (
          <li key={mk.id}>
            <button onClick={() => onSelect(mk.id)}>
              {mk.name} {mk.location ? `(${mk.location})` : ""}
            </button>
            <button className="delete-btn" onClick={() => handleDelete(mk.id)}>
              🗑 Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatchmakerList;

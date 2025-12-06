import { useState } from "react";
import "../styles/MatchList.css";
import DeleteButton from "./DeleteButton";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

function MatchList({ matches, onDelete, refresh }) {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  if (!matches || matches.length === 0) {
    return <p>No matches yet.</p>;
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this match permanently?")) return;

    try {
      // If parent provided custom delete logic, use it
      if (onDelete) {
        await onDelete(id);
      } else {
        // Fallback built-in delete
        await apiFetch(`/matches/${id}`, { method: "DELETE" });
      }

      if (refresh) refresh();
      setMsg("Match deleted ✔");
    } catch (err) {
      alert("Delete failed");
    } finally {
      setTimeout(() => setMsg(""), 2000);
    }
  }

  return (
    <ul className="match-list">
      {matches.map((m) => (
        <li key={m.id}>
          <p><strong>Status:</strong> {m.status}</p>
          <p><strong>Male:</strong> {m.male_single?.first_name} {m.male_single?.last_name}</p>
          <p><strong>Female:</strong> {m.female_single?.first_name} {m.female_single?.last_name}</p>

          {m.notes && <em>{m.notes}</em>}

          <div className="match-actions">
            <button
              className="edit-pill"
              onClick={() => navigate(`/matches/${m.id}/edit`)}
            >
              ✏️
            </button>

            <DeleteButton onClick={() => handleDelete(m.id)} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default MatchList;

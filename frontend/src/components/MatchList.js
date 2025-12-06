import { useState } from "react";
import "../styles/MatchList.css";
import DeleteButton from "./DeleteButton";
import { useNavigate } from "react-router-dom";

function MatchList({ matches, onDelete, refresh, onView }) {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleDelete(id) {
    if (!window.confirm("Delete this match permanently?")) return;

    try {
      if (onDelete) {
        await onDelete(id);
      }
      if (refresh) {
        refresh();
      }
      setMsg("Match deleted ✔");
    } catch (err) {
      alert("Delete failed");
    } finally {
      setTimeout(() => setMsg(""), 2000);
    }
  }

  if (!matches || !matches.length) {
    return <p>No matches yet.</p>;
  }

  return (
    <div>
      {msg && <div className="success-banner">{msg}</div>}

      <ul className="match-list">
        {matches.map((m) => (
          <li
            key={m.id}
            className={onView ? "match-row clickable" : "match-row"}
            onClick={() => onView && onView(m.id)}
          >
            <p>
              <strong>Status:</strong> {m.status}
            </p>
            <p>
              <strong>Male:</strong> {m.male_single?.first_name}{" "}
              {m.male_single?.last_name}
            </p>
            <p>
              <strong>Female:</strong> {m.female_single?.first_name}{" "}
              {m.female_single?.last_name}
            </p>
            {m.notes && <em>{m.notes}</em>}

            <div
              className="match-actions"
              onClick={(e) => e.stopPropagation()}
            >
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
    </div>
  );
}

export default MatchList;

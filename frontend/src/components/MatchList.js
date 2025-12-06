import { useState } from "react";
import "../styles/MatchList.css";
import DeleteButton from "./DeleteButton";
import { useNavigate } from "react-router-dom";

function MatchList({ matches, onDelete, refresh, onView }) {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  if (!matches?.length) return <p>No matches yet.</p>;

  async function handleDelete(id) {
    if (!window.confirm("Delete this match permanently?")) return;

    try {
      if (onDelete) {
        await onDelete(id); // parent does the API call
      }

      if (refresh) {
        refresh(); // optional reload callback
      }

      setMsg("Match deleted ✔");
    } catch (err) {
      alert("Delete failed");
    } finally {
      setTimeout(() => setMsg(""), 2000);
    }
  }

  function handleEdit(id) {
    if (onView) {
      // If SingleDetail passes a custom handler
      onView(id);
    } else {
      // Default: go to edit page
      navigate(`/matches/${id}/edit`);
    }
  }

  return (
    <>
      {msg && <p className="match-success-msg">{msg}</p>}
      <ul className="match-list">
        {matches.map((m) => (
          <li key={m.id}>
            <p>
              <strong>Status:</strong> {m.status}
            </p>
            <p>
              <strong>Male:</strong>{" "}
              {m.male_single?.first_name} {m.male_single?.last_name}
            </p>
            <p>
              <strong>Female:</strong>{" "}
              {m.female_single?.first_name} {m.female_single?.last_name}
            </p>
            {m.notes && <em>{m.notes}</em>}

            <div className="match-actions">
              <button
                className="edit-pill"
                type="button"
                onClick={() => handleEdit(m.id)}
              >
                ✏️
              </button>

              <DeleteButton onClick={() => handleDelete(m.id)} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default MatchList;

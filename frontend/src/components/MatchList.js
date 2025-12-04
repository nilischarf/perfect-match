import { useState } from "react";
import "../styles/MatchList.css";
import DeleteButton from "./DeleteButton";
import { apiFetch } from "../utils/api";

function MatchList({ matches, refresh }) {
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState("");

  async function handleDelete(id) {
    if (!window.confirm("Delete this match permanently?")) return;

    try {
      setDeleting(id);
      await apiFetch(`/matches/${id}`, { method: "DELETE" });
      setMsg("Match deleted successfully ✔");
      refresh && refresh();
    } catch (err) {
      alert(err.data?.error || "Delete failed");
    } finally {
      setDeleting(null);
      setTimeout(() => setMsg(""), 2500);
    }
  }

  if (!matches.length) return <p>No matches yet.</p>;

  return (
    <div>
      {msg && <div className="success-banner">{msg}</div>}

      <ul>
        {matches.map((m) => (
          <li key={m.id} className="match-item">
            <p><strong>Status:</strong> {m.status || "N/A"}</p>
            <p>
              <strong>Male:</strong>{" "}
              {m.male_single
                ? `${m.male_single.first_name} ${m.male_single.last_name}`
                : "N/A"}
            </p>
            <p>
              <strong>Female:</strong>{" "}
              {m.female_single
                ? `${m.female_single.first_name} ${m.female_single.last_name}`
                : "N/A"}
            </p>

            {m.notes && <em>{m.notes}</em>}

            {/* FIXED: call handleDelete, not onDelete */}
            <DeleteButton onClick={() => handleDelete(m.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatchList;

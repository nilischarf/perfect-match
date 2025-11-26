import React, { useState } from "react";
import SingleDetail from "./SingleDetail";
import "../styles/SinglesList.css";
import { apiFetch } from "../utils/api";

function SinglesList({ singles, type, refresh }) {
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState("");

  async function handleDelete(id) {
    if (!window.confirm(`Delete this ${type}?`)) return;

    try {
      await apiFetch(`/${type === "male" ? "male_singles" : "female_singles"}/${id}`, { method:"DELETE" });
      setMsg(`${type} deleted ✔`);
      refresh && refresh();
    } catch(err){
      alert(err.data?.error || "Failed to delete");
    } finally {
      setTimeout(()=>setMsg(""),2000);
    }
  }

  return (
    <div className="singles-layout">
      {msg && <div className="success-banner">{msg}</div>}

      <ul>
        {singles.map((s) => (
          <li key={s.id}>
            <button onClick={() => setSelected(s)}>
              {s.first_name} {s.last_name} ({s.age})
            </button>

            <button className="delete-btn" onClick={() => handleDelete(s.id)}>
              🗑 Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="detail-panel">
        {selected ? <SingleDetail single={selected} type={type} /> : <p>Select one to view details</p>}
      </div>
    </div>
  );
}

export default SinglesList;

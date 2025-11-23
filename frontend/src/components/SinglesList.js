import React, { useState } from "react";
import SingleDetail from "./SingleDetail";
import "../styles/SinglesList.css";

function SinglesList({ singles, type }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="singles-layout">
      <ul>
        {singles.map((s) => (
          <li key={s.id}>
            <button type="button" onClick={() => setSelected(s)}>
              {s.first_name} {s.last_name} ({s.age})
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginLeft: "2rem" }}>
        {selected ? (
          <SingleDetail single={selected} type={type} />
        ) : (
          <p>Select a {type} to view details and matches.</p>
        )}
      </div>
    </div>
  );
}

export default SinglesList;

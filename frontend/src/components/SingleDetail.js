import { useState } from "react";
import MatchList from "./MatchList";

function SingleDetail({ single, type }) {
  const [localSingle, setLocalSingle] = useState(single);

  function handleMatchDelete(deletedId) {
    setLocalSingle(prev => ({
      ...prev,
      matches: prev.matches.filter(m => m.id !== deletedId)
    }));
  }

  return (
    <div>
      <h2>{localSingle.first_name} {localSingle.last_name}</h2>

      <p>Age: {localSingle.age}</p>
      <p>Gender: {localSingle.gender}</p>
      <p>Location: {localSingle.location}</p>
      <p>Phone: {localSingle.phone_number}</p>

      {localSingle.notes && <p>Notes: {localSingle.notes}</p>}

      <h3>Matches for this {type === "male" ? "man" : "woman"}</h3>

      <MatchList
        matches={localSingle.matches || []}
        onDelete={handleMatchDelete}   // 👈 UPDATE LOCAL STATE
      />
    </div>
  );
}

export default SingleDetail;

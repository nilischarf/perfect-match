import React from "react";
import MatchList from "./MatchList";

function SingleDetail({ single, type }) {
  return (
    <div>
      <h2>
        {single.first_name} {single.last_name}
      </h2>
      <p>Age: {single.age}</p>
      <p>Gender: {single.gender}</p>
      <p>Location: {single.location}</p>
      <p>Phone: {single.phone_number}</p>
      {single.notes && <p>Notes: {single.notes}</p>}

      <h3>Matches for this {type === "male" ? "man" : "woman"}</h3>
      <MatchList matches={single.matches || []} />
    </div>
  );
}

export default SingleDetail;

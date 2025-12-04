import { useNavigate } from "react-router-dom";
import MatchList from "./MatchList";
import "../styles/SingleDetail.css";

function SingleDetail({ single, type }) {
  const navigate = useNavigate();

  function handleViewMatch(id) {
    navigate(`/matches/${id}`);
  }

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

      <MatchList
        matches={single.matches || []}
        onView={handleViewMatch}     // 👈 NEW: opens match detail page
      />
    </div>
  );
}

export default SingleDetail;

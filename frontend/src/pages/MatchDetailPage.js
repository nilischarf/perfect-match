import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import DeleteButton from "../components/DeleteButton";

function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch(`/matches/${id}`);
        setMatch(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [id]);

  if (!match) return <p>Loading match...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Match Details</h1>

      <p><strong>Status:</strong> {match.status}</p>
      <p><strong>Male:</strong> {match.male_single?.first_name} {match.male_single?.last_name}</p>
      <p><strong>Female:</strong> {match.female_single?.first_name} {match.female_single?.last_name}</p>
      {match.notes && <p><em>{match.notes}</em></p>}

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button
          className="pink-button"
          onClick={() => navigate(`/matches/${id}/edit`)}
        >
          ✏️ Edit Match
        </button>

        <DeleteButton onClick={() => navigate(`/matches`)} />
      </div>
    </div>
  );
}

export default MatchDetailPage;

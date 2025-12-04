import { useNavigate } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import PinkPillButton from "./PinkPillButton";
import "../styles/MatchList.css";

function MatchList({ matches, refresh }) {
  const navigate = useNavigate();

  if (!matches.length) return <p>No matches yet.</p>;

  return (
    <ul className="match-list">
      {matches.map((m) => (
        <li key={m.id} className="match-item">
          <div className="match-info">
            <p><strong>Status:</strong> {m.status}</p>
            <p><strong>Male:</strong> {m.male_single?.first_name} {m.male_single?.last_name}</p>
            <p><strong>Female:</strong> {m.female_single?.first_name} {m.female_single?.last_name}</p>
            {m.notes && <em>{m.notes}</em>}
          </div>

          <div className="match-actions">
            <PinkPillButton
              icon="✏️"
              onClick={() => navigate(`/matches/${m.id}/edit`)}
            />

            <DeleteButton onClick={() => refresh(m.id)} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default MatchList;

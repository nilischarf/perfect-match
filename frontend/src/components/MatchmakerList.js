import DeleteButton from "./DeleteButton";
import "../styles/MatchmakerList.css";

function MatchmakerList({ matchmakers, onSelect, onDelete }) {
  if (!matchmakers.length) return <p>No matchmakers yet.</p>;

  return (
    <ul className="matchmaker-list">
      {matchmakers.map((mk) => (
        <li key={mk.id} className="matchmaker-row">
          <button
            type="button"
            onClick={() => onSelect(mk.id)}
            className="matchmaker-item"
          >
            {mk.name} {mk.location ? `(${mk.location})` : ""}
          </button>
          <DeleteButton onClick={() => onDelete(mk.id)} />
        </li>
      ))}
    </ul>
  );
}

export default MatchmakerList;

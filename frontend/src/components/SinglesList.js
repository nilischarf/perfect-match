import { useNavigate } from "react-router-dom";

function SinglesList({ singles, type }) {
  const navigate = useNavigate();

  return (
    <div className="singles-layout">
      <ul>
        {singles.map((s) => (
          <li key={s.id} className="single-row">
            <button
              type="button"
              className="single-item"
              onClick={() => navigate(`/${type}-singles/${s.id}`)}
            >
              {s.first_name} {s.last_name} ({s.age})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SinglesList;

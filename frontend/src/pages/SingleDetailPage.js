import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

function SingleDetailPage({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [single, setSingle] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // IMPORTANT: use backend’s underscore-style endpoints
        const endpoint =
          type === "male"
            ? `/male_singles/${id}`
            : `/female_singles/${id}`;

        const data = await apiFetch(endpoint);
        setSingle(data);
      } catch (err) {
        console.error("Failed to load single:", err);
      }
    }

    load();
  }, [id, type]);

  if (!single) return <p>Loading...</p>;

  return (
    <div style={{ padding: "5rem 1rem 1rem" }}>
      <h1>{single.first_name} {single.last_name}</h1>

      <p><strong>Age:</strong> {single.age}</p>
      <p><strong>Gender:</strong> {single.gender}</p>
      <p><strong>Location:</strong> {single.location}</p>
      <p><strong>Phone:</strong> {single.phone_number}</p>

      {single.notes && (
        <p><strong>Notes:</strong> {single.notes}</p>
      )}

      <h2 style={{ marginTop: "2rem" }}>Matches</h2>

      {single.matches.length === 0 ? (
        <p>No matches yet</p>
      ) : (
        <ul>
          {single.matches.map((m) => (
            <li key={m.id}>
              <button
                className="link-button"
                onClick={() => navigate(`/matches/${m.id}`)}
              >
                Match #{m.id} — {m.status}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SingleDetailPage;

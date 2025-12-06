import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMatchmakers, createMatchmaker } from "../utils/api";
import MatchmakerList from "../components/MatchmakerList";
import "../styles/MatchmakersPage.css";

function MatchmakersPage() {
  const [matchmakers, setMatchmakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMatchmakers();
        setMatchmakers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load matchmakers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError("");

    if (!newName.trim()) {
      setFormError("Name is required.");
      return;
    }

    try {
      const created = await createMatchmaker({
        name: newName.trim(),
        location: newLocation.trim() || null,
      });
      setMatchmakers((prev) => [...prev, created]);
      setNewName("");
      setNewLocation("");
    } catch (err) {
      console.error(err);
      setFormError(err.data?.error || "Could not create matchmaker");
    }
  }

  if (loading) return <div>Loading matchmakers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="matchmakers-container">
      <h1>Matchmakers</h1>

      <MatchmakerList
        matchmakers={matchmakers}
        onSelect={(id) => navigate(`/matchmakers/${id}`)}
      />

      <h2>Add Matchmaker</h2>
      <form onSubmit={handleCreate} className="add-form">
        {formError && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>{formError}</p>
        )}
        <div>
          <label>
            Name
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Location
            <input
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Add Matchmaker</button>
      </form>
    </div>
  );
}

export default MatchmakersPage;

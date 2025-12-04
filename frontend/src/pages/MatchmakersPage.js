import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";
import {
  fetchMatchmakers,
  createMatchmaker
} from "../utils/api";
import MatchmakerList from "../components/MatchmakerList";
import "../styles/MatchmakersPage.css";

function MatchmakersPage() {
  const [matchmakers, setMatchmakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMatchmakers();
        console.log("MATCHMAKERS FROM API:", data);
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
    try {
      const created = await createMatchmaker({
        name: newName,
        location: newLocation
      });
      setMatchmakers((prev) => [...prev, created]);
      setNewName("");
      setNewLocation("");
    } catch (err) {
      console.error(err);
      alert("Could not create matchmaker");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this matchmaker?")) return;

    try {
      await apiFetch(`/matchmakers/${id}`, { method: "DELETE" });
      setMatchmakers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete matchmaker");
    }
  }

  if (loading) return <div>Loading matchmakers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Matchmakers</h1>

      <MatchmakerList
        matchmakers={matchmakers}
        onSelect={(id) => navigate(`/matchmakers/${id}`)}
        onDelete={handleDelete}
      />

      <h2>Add Matchmaker</h2>
      <form onSubmit={handleCreate} style={{ maxWidth: 400 }}>
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

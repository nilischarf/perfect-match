import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMatchmakers, apiFetch } from "../utils/api";
import MatchmakerList from "../components/MatchmakerList";
import MatchmakerForm from "../components/MatchmakerForm";
import "../styles/MatchmakersPage.css";

function MatchmakersPage() {
  const [matchmakers, setMatchmakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  async function handleCreateMatchmaker(data) {
    try {
      const created = await apiFetch("/matchmakers", {
        method: "POST",
        body: JSON.stringify(data)
      });

      setMatchmakers(prev => [...prev, created]);

    } catch (err) {
      alert(err.data?.error || "Failed to create matchmaker");
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
      <MatchmakerForm onSubmit={handleCreateMatchmaker} />  
    </div>
  );
}

export default MatchmakersPage;

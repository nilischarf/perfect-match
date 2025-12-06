import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMatchmaker, apiFetch } from "../utils/api";
import MatchmakerDetail from "../components/MatchmakerDetail";

function MatchmakerDetailPage() {
  const { id } = useParams();
  const [matchmaker, setMatchmaker] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await fetchMatchmaker(id);
      setMatchmaker(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMatch(matchId) {
    try {
      await apiFetch(`/matches/${matchId}`, { method: "DELETE" });

      setMatchmaker((prev) => ({
        ...prev,
        matches: prev.matches.filter((m) => m.id !== matchId)
      }));
    } catch (err) {
      alert("Failed to delete match");
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <p>Loading matchmaker...</p>;
  if (!matchmaker) return <p>Not found</p>;

  return (
    <MatchmakerDetail
      matchmaker={matchmaker}
      onDeleteMatch={handleDeleteMatch}
    />
  );
}

export default MatchmakerDetailPage;

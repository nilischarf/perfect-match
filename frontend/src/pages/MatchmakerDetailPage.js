import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMatchmaker } from "../utils/api";
import MatchmakerDetail from "../components/MatchmakerDetail";

function MatchmakerDetailPage() {
  const { id } = useParams();
  const [matchmaker, setMatchmaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMatchmaker(id);
        setMatchmaker(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load matchmaker");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div>Loading matchmaker...</div>;
  if (error) return <div>{error}</div>;
  if (!matchmaker) return <div>Not found</div>;

  return <MatchmakerDetail matchmaker={matchmaker} />;
}

export default MatchmakerDetailPage;

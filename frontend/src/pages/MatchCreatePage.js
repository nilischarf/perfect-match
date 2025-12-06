import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiFetch,
  fetchMaleSingles,
  fetchFemaleSingles,
  fetchMatchmakers
} from "../utils/api";
import CreateMatchForm from "../components/CreateMatchForm";

function MatchCreatePage() {
  const [matchmakers, setMatchmakers] = useState([]);
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [mkList, maleList, femaleList] = await Promise.all([
          fetchMatchmakers(),
          fetchMaleSingles(),
          fetchFemaleSingles()
        ]);

        setMatchmakers(mkList);
        setMales(maleList);
        setFemales(femaleList);
      } catch (err) {
        console.error(err);
        alert("Failed to load form options");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleSubmit(formData) {
    try {
      const newMatch = await apiFetch("/matches", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      alert("Match created ✔");
      navigate(`/matches/${newMatch.id}`);
    } catch (err) {
      alert(err.data?.error || "Could not create match");
    }
  }

  if (loading) return <p>Loading match form...</p>;

  return (
    <div>
      <h1>Create New Match</h1>

      <CreateMatchForm
        matchmakers={matchmakers}
        males={males}
        females={females}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default MatchCreatePage;

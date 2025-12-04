import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch, fetchMaleSingles, fetchFemaleSingles } from "../utils/api";
import MatchForm from "../components/MatchForm";

function MatchEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [matchData, maleList, femaleList] = await Promise.all([
          apiFetch(`/matches/${id}`),
          fetchMaleSingles(),
          fetchFemaleSingles()
        ]);

        setMatch(matchData);
        setMales(maleList);
        setFemales(femaleList);
      } catch (err) {
        console.error(err);
        alert("Failed to load match");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(formData) {
    try {
      await apiFetch(`/matches/${id}`, {
        method: "PATCH",
        body: JSON.stringify(formData)
      });
      alert("Match updated ✔");
      navigate(`/matches/${id}`); // Go back to details page
    } catch (err) {
      alert(err.data?.error || "Update failed");
    }
  }

  if (loading) return <p>Loading match...</p>;
  if (!match) return <p>Match not found.</p>;

  return (
    <div>
      <h1>Edit Match</h1>
      <MatchForm
        initialValues={{
          status: match.status || "",
          male_id: match.male_id,
          female_id: match.female_id,
          notes: match.notes || ""
        }}
        males={males}
        females={females}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default MatchEditPage;

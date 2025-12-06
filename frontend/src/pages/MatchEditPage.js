// src/pages/MatchEditPage.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import MatchForm from "../components/MatchForm";

function MatchEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const matchData = await apiFetch(`/matches/${id}`);
        setMatch(matchData);
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
      // only send fields we actually allow to be updated
      await apiFetch(`/matches/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: formData.status,
          notes: formData.notes
        })
      });
      alert("Match updated ✔");
      navigate(`/matches/${id}`); // back to details page
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
          notes: match.notes || ""
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default MatchEditPage;

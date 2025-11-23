import React, { useEffect, useState } from "react";
import { fetchFemaleSingles, createFemaleSingle } from "../utils/api";
import SinglesList from "../components/SinglesList";
import SingleForm from "../components/SingleForm";
import "../styles/FemaleSinglesPage.css";

function FemaleSinglesPage() {
  const [singles, setSingles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchFemaleSingles();
        setSingles(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load female singles");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleCreateSingle(payload) {
    try {
      const created = await createFemaleSingle({
        ...payload,
        gender: "Female"
      });
      setSingles((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
      alert("Could not create female single");
    }
  }

  if (loading) return <div>Loading female singles...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Female Singles</h1>
      <SinglesList singles={singles} type="female" />
      <h2>Add Female Single</h2>
      <SingleForm onSubmit={handleCreateSingle} defaultGender="Female" />
    </div>
  );
}

export default FemaleSinglesPage;

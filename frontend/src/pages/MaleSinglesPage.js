import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { fetchMaleSingles, createMaleSingle } from "../utils/api";
import SinglesList from "../components/SinglesList";
import SingleForm from "../components/SingleForm";
import "../styles/MaleSinglesPage.css";

function MaleSinglesPage() {
  const [singles, setSingles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMaleSingles();
        setSingles(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load male singles");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleCreateSingle(payload) {
    try {
      const created = await createMaleSingle({
        ...payload,
        gender: "Male"
      });
      setSingles((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
      alert("Could not create male single");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this male single?")) return;

    try {
      await apiFetch(`/male_singles/${id}`, { method: "DELETE" });
      setSingles(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert(err?.data?.error || "Delete failed");
    }
  }

  if (loading) return <div>Loading male singles...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Male Singles</h1>
      <SinglesList singles={singles} type="male" onDelete={handleDelete} />
      <h2>Add Male Single</h2>
      <SingleForm onSubmit={handleCreateSingle} defaultGender="Male" />
    </div>
  );
}

export default MaleSinglesPage;

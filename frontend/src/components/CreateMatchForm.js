import { useState } from "react";
import "../styles/MatchForm.css";

function CreateMatchForm({ matchmakers, males, females, onSubmit }) {
  const [form, setForm] = useState({
    status: "",
    matchmaker_id: "",
    male_single_id: "",
    female_single_id: "",
    notes: ""
  });

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.matchmaker_id || !form.male_single_id || !form.female_single_id || !form.status) {
      return alert("Please select a matchmaker, male, female, and status.");
    }

    onSubmit(form);
  }

  return (
    <form className="match-form" onSubmit={handleSubmit}>
      {/* Matchmaker dropdown */}
      <label>
        Matchmaker
        <select
          name="matchmaker_id"
          value={form.matchmaker_id}
          onChange={updateField}
          required
        >
          <option value="">-- Select Matchmaker --</option>
          {matchmakers.map((mk) => (
            <option key={mk.id} value={mk.id}>
              {mk.name} {mk.location ? `(${mk.location})` : ""}
            </option>
          ))}
        </select>
      </label>

      {/* Status */}
      <label>
        Status
        <select name="status" value={form.status} onChange={updateField} required>
          <option value="">-- Select Status --</option>
          <option value="Introduced">Introduced</option>
          <option value="Dating">Dating</option>
          <option value="Failed">Failed</option>
          <option value="Married">Married</option>
        </select>
      </label>

      {/* Male dropdown */}
      <label>
        Male
        <select
          name="male_single_id"
          value={form.male_id}
          onChange={updateField}
          required
        >
          <option value="">-- Select Male --</option>
          {males.map((m) => (
            <option key={m.id} value={m.id}>
              {m.first_name} {m.last_name} ({m.age})
            </option>
          ))}
        </select>
      </label>

      {/* Female dropdown */}
      <label>
        Female
        <select
          name="female_single_id"
          value={form.female_single_id}
          onChange={updateField}
          required
        >
          <option value="">-- Select Female --</option>
          {females.map((f) => (
            <option key={f.id} value={f.id}>
              {f.first_name} {f.last_name} ({f.age})
            </option>
          ))}
        </select>
      </label>

      {/* Notes */}
      <label>
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={updateField}
          rows="4"
        />
      </label>

      <button className="pink-button" type="submit">
        Create Match
      </button>
    </form>
  );
}

export default CreateMatchForm;

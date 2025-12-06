// src/components/MatchForm.js
import { useState, useEffect } from "react";
import "../styles/MatchForm.css";

function MatchForm({ initialValues, onSubmit }) {
  const [form, setForm] = useState(initialValues);

  // keep form in sync if initialValues change
  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="match-form" onSubmit={handleSubmit}>
      {/* STATUS ONLY */}
      <label>
        Status
        <select
          name="status"
          value={form.status}
          onChange={updateField}
          required
        >
          <option value="">-- Select Status --</option>
          <option value="Introduced">Introduced</option>
          <option value="Dating">Dating</option>
          <option value="Failed">Failed</option>
          <option value="Married">Married</option>
        </select>
      </label>

      {/* NOTES ONLY */}
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
        Save Changes
      </button>
    </form>
  );
}

export default MatchForm;

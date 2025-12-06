import { useState } from "react";
import "../styles/MatchForm.css";

function MatchForm({ initialValues, males, females, onSubmit }) {
  const [form, setForm] = useState(initialValues);

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

      <label>
        Male
        <select
          name="male_id"
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

      <label>
        Female
        <select
          name="female_id"
          value={form.female_id}
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

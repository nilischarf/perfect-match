import { useState } from "react";

function MatchmakerForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    email_address: "",
    phone_number: "",
    salary: ""
  });

  const [error, setError] = useState("");

  function update(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.location || !form.email_address || !form.phone_number || !form.salary) {
      setError("⚠ All fields are required.");
      return;
    }

    if (!form.email_address.includes("@")) {
      setError("⚠ Invalid email address.");
      return;
    }

    if (form.salary <= 0) {
      setError("⚠ Salary must be a positive number.");
      return;
    }

    setError("");
    onSubmit({
      ...form,
      salary: Number(form.salary)
    });

    setForm({
      name: "",
      location: "",
      email_address: "",
      phone_number: "",
      salary: ""
    });
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Add New Matchmaker</h3>

      {error && <p className="error-alert">{error}</p>}

      <label>Name
        <input name="name" value={form.name} onChange={update} required />
      </label>

      <label>Location
        <input name="location" value={form.location} onChange={update} required />
      </label>

      <label>Email
        <input name="email_address" value={form.email_address} onChange={update} required />
      </label>

      <label>Phone Number
        <input name="phone_number" value={form.phone_number} onChange={update} required />
      </label>

      <label>Salary
        <input type="number" name="salary" value={form.salary} onChange={update} required />
      </label>

      <button className="pink-button" type="submit">💖 Add Matchmaker</button>
    </form>
  );
}

export default MatchmakerForm;

import React, { useState } from "react";
import "../styles/SingleForm.css";

function SingleForm({ onSubmit, defaultGender }) {
  const [formError, setFormError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(defaultGender || "");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!firstName || !lastName || !age || Number(age) < 18 || !gender) {
      return setFormError("⚠ Please fill all required fields. Age must be 18+.");
    }

    setFormError("");

    onSubmit({
      first_name: firstName,
      last_name: lastName,
      age: Number(age),
      gender,
      location,
      phone_number: phoneNumber,
      notes
    });

    setFirstName("");
    setLastName("");
    setAge("");
    setLocation("");
    setPhoneNumber("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} className="single-form">
      {formError && <p className="error-alert">{formError}</p>}

      <label>
        First Name
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </label>

      <label>
        Last Name
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </label>

      <label>
        Age
        <input
          type="number"
          min="18"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </label>

      <label>
        Gender
        <input
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        />
      </label>

      <label>
        Location
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>

      <label>
        Phone
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </label>

      <label>
        Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <button type="submit">💖 Save</button>
    </form>
  );
}

export default SingleForm;

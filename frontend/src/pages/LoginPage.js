import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      onLogin(res.user);
    } catch (err) {
      setError(err.data.error || "Login failed");
    }
  }

  return (
    <div>
      <h1>PerfectMatch Login</h1>

      <form onSubmit={handleSubmit}>
        <input 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

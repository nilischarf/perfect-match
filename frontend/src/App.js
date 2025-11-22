import { useEffect, useState } from "react";
import { apiFetch } from "./utils/api";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on first load
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await apiFetch("/auth/check_session");
        if (res.logged_in) {
          setUser(res.user);
        }
      } catch {}
      setLoading(false);
    }
    checkSession();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) return <LoginPage onLogin={setUser} />;

  return <Dashboard user={user} />;
}

export default App;

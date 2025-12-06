import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MaleSinglesPage from "./pages/MaleSinglesPage";
import FemaleSinglesPage from "./pages/FemaleSinglesPage";
import MatchmakersPage from "./pages/MatchmakersPage";
import MatchmakerDetailPage from "./pages/MatchmakerDetailPage";

import MatchDetailPage from "./pages/MatchDetailPage";
import MatchEditPage from "./pages/MatchEditPage";

import { checkSessionApi, logoutApi } from "./utils/api";

function App() {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const data = await checkSessionApi();
        if (data.logged_in) setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setAuthLoaded(true);
      }
    }

    check();
  }, []);

  async function handleLogout() {
    await logoutApi();
    setUser(null);
  }

  if (!authLoaded) return <div>Loading...</div>;

  return (
    <>
      <NavBar user={user} onLogout={handleLogout} />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/" element={<HomePage />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/male-singles"
          element={
            <ProtectedRoute user={user}>
              <MaleSinglesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/female-singles"
          element={
            <ProtectedRoute user={user}>
              <FemaleSinglesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matchmakers"
          element={
            <ProtectedRoute user={user}>
              <MatchmakersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matchmakers/:id"
          element={
            <ProtectedRoute user={user}>
              <MatchmakerDetailPage />
            </ProtectedRoute>
          }
        />

        {/* MATCH ROUTES */}
        <Route
          path="/matches/:id"
          element={
            <ProtectedRoute user={user}>
              <MatchDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches/:id/edit"
          element={
            <ProtectedRoute user={user}>
              <MatchEditPage />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;

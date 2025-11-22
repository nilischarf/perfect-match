// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar";
// import ProtectedRoute from "./components/ProtectedRoute";

// import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
// import MatchmakersPage from "./pages/MatchmakersPage";
// import MatchmakerDetailPage from "./pages/MatchmakerDetailPage";
// import MaleSinglesPage from "./pages/MaleSinglesPage";
// import FemaleSinglesPage from "./pages/FemaleSinglesPage";

import { checkSessionApi, logoutApi } from "./utils/api";

function App() {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  // Check session on first load
  useEffect(() => {
    async function check() {
      try {
        const data = await checkSessionApi();
        if (data.logged_in) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setUser(null);
      } finally {
        setAuthLoaded(true);
      }
    }
    check();
  }, []);

  async function handleLogout() {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
    }
  }

  if (!authLoaded) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <NavBar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          {/* <Route path="/" element={<HomePage user={user} />} /> */}

          <Route
            path="/login"
            element={
              // user ? (
              //   <Navigate to="/" replace />
              // ) : (
                <LoginPage onLogin={setUser} />
              // )
            }
          />

          {/* Protected routes
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

          {/* 404 */}
          {/* <Route path="*" element={<div>Page not found</div>} /> */} 
        </Routes>
      </main>
    </div>
  );
}

export default App;

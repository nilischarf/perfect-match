import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import "../styles/ProtectedRoute.css";

function ProtectedRoute({ user, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;

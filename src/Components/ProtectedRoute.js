// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const auth = getAuth();

const ProtectedRoute = ({ allowedEmail, redirectTo = "/", children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>; // optional loading state

  if (!user) return <Navigate to={redirectTo} replace />; // not signed in

  if (allowedEmail && user.email !== allowedEmail)
    return <Navigate to={redirectTo} replace />; // not authorized

  return children; // authorized
};

export default ProtectedRoute;

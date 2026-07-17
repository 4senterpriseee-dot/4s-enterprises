import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import PageSkeleton from "@/components/ui/PageSkeleton";

/**
 * Protects a route behind authentication.
 *
 * - If `loading` is true, shows a minimal placeholder while the session
 *   is being restored on app mount.
 * - If no user is found after loading, redirects to /login.
 * - If `role` is specified (e.g. "seller"), enforces that the user has that
 *   exact role; otherwise redirects to /.
 * - Default behaviour (no `role` prop) allows any authenticated user.
 */
const Protected = ({ children, role = null }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return <PageSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role?.toLowerCase().trim() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;

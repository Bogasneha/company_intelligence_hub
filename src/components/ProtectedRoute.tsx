import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a loading spinner or some placeholder while checking auth status
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Render the child routes
  return <Outlet />;
}

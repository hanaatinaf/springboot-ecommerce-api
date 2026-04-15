import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component wraps pages that require login.
// If the user is not logged in, it redirects them to /login instead of showing the page.
// Usage in App.jsx: <Route path="/posts/new" element={<ProtectedRoute><WritePost /></ProtectedRoute>} />
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  // <Navigate> is React Router's way of redirecting programmatically
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

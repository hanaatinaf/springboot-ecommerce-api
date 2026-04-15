import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home       from './pages/Home';
import Login      from './pages/Login';
import Register   from './pages/Register';
import PostDetail from './pages/PostDetail';
import WritePost  from './pages/WritePost';
import MyPosts    from './pages/MyPosts';
import Profile    from './pages/Profile';

// App is the root component — it sets up:
// 1. AuthProvider: makes login state available everywhere
// 2. BrowserRouter: enables client-side navigation (no full page reloads)
// 3. Routes: maps URL paths to page components
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/posts/:id"      element={<PostDetail />} />

          {/* Protected routes — redirect to /login if not authenticated */}
          <Route path="/posts/new"      element={<ProtectedRoute><WritePost /></ProtectedRoute>} />
          <Route path="/posts/:id/edit" element={<ProtectedRoute><WritePost /></ProtectedRoute>} />
          <Route path="/my-posts"       element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
          <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// useState = React hook for local component state.
// Every time you call setXxx(), React re-renders this component with the new value.
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the browser from refreshing the page (default form behavior)
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/'); // redirect to home page after successful login
    } catch (err) {
      // err.response?.data?.message = the error message from our Spring Boot controller
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.sub}>Log in to your DevBlog account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title: { margin: 0, fontSize: '1.8rem', color: '#1a1a2e' },
  sub: { color: '#888', marginTop: '0.5rem', marginBottom: '1.5rem' },
  error: { background: '#ffeaea', color: '#c00', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  label: { fontSize: '0.9rem', fontWeight: 600, color: '#444' },
  input: { padding: '0.65rem 0.9rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' },
  btn: { marginTop: '0.5rem', padding: '0.75rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
  footer: { marginTop: '1.5rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' },
};

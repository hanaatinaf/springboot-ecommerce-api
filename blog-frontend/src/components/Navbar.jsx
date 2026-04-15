import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// useNavigate() = React Router hook that lets you redirect programmatically
// Link = React Router's replacement for <a href="..."> — navigates without full page reload
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>DevBlog</Link>

      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/posts/new" style={styles.link}>Write Post</Link>
            <Link to="/my-posts" style={styles.link}>My Posts</Link>
            <Link to="/profile" style={styles.link}>{user.username}</Link>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btnLink}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 2rem', height: '60px', background: '#1a1a2e', color: '#fff',
    position: 'sticky', top: 0, zIndex: 100,
  },
  brand: {
    color: '#e94560', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none',
  },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.95rem' },
  btn: {
    background: 'transparent', border: '1px solid #e94560', color: '#e94560',
    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
  },
  btnLink: {
    background: '#e94560', color: '#fff', padding: '6px 14px',
    borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem',
  },
};

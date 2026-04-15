import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', bio: '', avatarUrl: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile').then(res => {
      setProfile(res.data || {});
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => {
    setProfile(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put('/profile', profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Edit Profile</h2>
        <p style={styles.sub}>Logged in as <strong>{user?.username}</strong></p>

        {saved && <div style={styles.success}>Profile saved!</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>First Name</label>
              <input style={styles.input} value={profile.firstName || ''} onChange={handleChange('firstName')} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Last Name</label>
              <input style={styles.input} value={profile.lastName || ''} onChange={handleChange('lastName')} />
            </div>
          </div>

          <label style={styles.label}>Bio</label>
          <textarea
            style={{ ...styles.input, height: '120px', resize: 'vertical', fontFamily: 'inherit' }}
            value={profile.bio || ''}
            onChange={handleChange('bio')}
            placeholder="Tell readers a little about yourself..."
          />

          <label style={styles.label}>Avatar URL</label>
          <input
            style={styles.input}
            value={profile.avatarUrl || ''}
            onChange={handleChange('avatarUrl')}
            placeholder="https://..."
          />

          <button type="submit" style={styles.btn}>Save Profile</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f4f6f8', minHeight: '100vh', padding: '2rem 1rem' },
  container: { maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' },
  loading: { textAlign: 'center', padding: '4rem', color: '#888' },
  title: { margin: 0, fontSize: '1.8rem', color: '#1a1a2e' },
  sub: { color: '#888', marginTop: '0.25rem', marginBottom: '1.5rem' },
  success: { background: '#e6f9ee', color: '#2d8a4e', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 600 },
  form: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  row: { display: 'flex', gap: '1rem' },
  label: { fontSize: '0.9rem', fontWeight: 600, color: '#444', marginTop: '0.5rem', display: 'block' },
  input: { width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { marginTop: '1rem', padding: '0.75rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
};

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

// This page handles both CREATE (/posts/new) and EDIT (/posts/:id/edit)
// We reuse one component for both by checking if an `id` param exists
export default function WritePost() {
  const { id } = useParams();         // undefined if creating, a number if editing
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle]           = useState('');
  const [content, setContent]       = useState('');
  const [summary, setSummary]       = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus]         = useState('draft');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    // Always load categories for the dropdown
    api.get('/categories').then(res => setCategories(res.data));

    // If editing, pre-fill the form with existing data
    if (isEditing) {
      api.get(`/posts/${id}`).then(res => {
        const p = res.data;
        setTitle(p.title || '');
        setContent(p.content || '');
        setSummary(p.summary || '');
        setCategoryId(p.categoryId || '');
        setStatus(p.status || 'draft');
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = { title, content, summary, status, categoryId: categoryId || null };

    try {
      if (isEditing) {
        await api.put(`/posts/${id}`, payload);
        navigate(`/posts/${id}`);
      } else {
        const res = await api.post('/posts', payload);
        navigate(`/posts/${res.data.postId}`);
      }
    } catch (err) {
      setError('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>{isEditing ? 'Edit Post' : 'Write a New Post'}</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Title *</label>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required placeholder="Give your post a title"
          />

          <label style={styles.label}>Summary</label>
          <input
            style={styles.input}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Short description shown on the home page"
          />

          <label style={styles.label}>Category</label>
          <select style={styles.input} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">No category</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
            ))}
          </select>

          <label style={styles.label}>Content *</label>
          <textarea
            style={{ ...styles.input, height: '300px', resize: 'vertical', fontFamily: 'inherit' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your post content here..."
          />

          <label style={styles.label}>Visibility</label>
          <select style={styles.input} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft (only you can see it)</option>
            <option value="published">Published (everyone can see it)</option>
          </select>

          <div style={styles.btnRow}>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f4f6f8', minHeight: '100vh', padding: '2rem 1rem' },
  container: { maxWidth: '720px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' },
  title: { fontSize: '1.8rem', margin: '0 0 1.5rem', color: '#1a1a2e' },
  error: { background: '#ffeaea', color: '#c00', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  label: { fontSize: '0.9rem', fontWeight: 600, color: '#444', marginTop: '0.5rem' },
  input: { padding: '0.65rem 0.9rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' },
  btnRow: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' },
  cancelBtn: { padding: '0.7rem 1.5rem', background: 'transparent', border: '1.5px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem' },
  submitBtn: { padding: '0.7rem 1.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' },
};

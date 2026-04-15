import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyPosts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get(`/posts/user/${user.userId}`)
        .then(res => setPosts(res.data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleDelete = async (postId) => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${postId}`);
    // Update the list locally without a full page reload — better UX
    setPosts(prev => prev.filter(p => p.postId !== postId));
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>My Posts</h2>
          <Link to="/posts/new" style={styles.newBtn}>+ New Post</Link>
        </div>

        {posts.length === 0 ? (
          <p style={{ color: '#888' }}>You haven&apos;t written any posts yet. <Link to="/posts/new">Write your first one!</Link></p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Likes</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.postId} style={styles.tr}>
                  <td style={styles.td}>
                    <Link to={`/posts/${post.postId}`} style={styles.postLink}>{post.title}</Link>
                  </td>
                  <td style={styles.td}>{post.categoryName || '—'}</td>
                  <td style={styles.td}>
                    <span style={post.status === 'published' ? styles.statusPublished : styles.statusDraft}>
                      {post.status}
                    </span>
                  </td>
                  <td style={styles.td}>♥ {post.likeCount}</td>
                  <td style={styles.td}>
                    <Link to={`/posts/${post.postId}/edit`} style={styles.editBtn}>Edit</Link>
                    <button onClick={() => handleDelete(post.postId)} style={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f4f6f8', minHeight: '100vh', padding: '2rem 1rem' },
  container: { maxWidth: '900px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' },
  loading: { textAlign: 'center', padding: '4rem', color: '#888' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { margin: 0, fontSize: '1.8rem', color: '#1a1a2e' },
  newBtn: { background: '#e94560', color: '#fff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid #eee', color: '#888', fontSize: '0.85rem', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '0.85rem 0.75rem', fontSize: '0.95rem', color: '#333' },
  postLink: { color: '#1a1a2e', fontWeight: 600, textDecoration: 'none' },
  statusPublished: { background: '#e6f9ee', color: '#2d8a4e', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 },
  statusDraft: { background: '#f0f0f0', color: '#888', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 },
  editBtn: { color: '#1a1a2e', marginRight: '0.75rem', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600 },
  deleteBtn: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 },
};

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// useParams() extracts route parameters — e.g. /posts/42 gives us { id: "42" }
export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost]         = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked]       = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Fetch post and comments in parallel using Promise.all —
    // more efficient than waiting for one to finish before the other starts
    Promise.all([
      api.get(`/posts/${id}`),
      api.get(`/comments/post/${id}`),
    ]).then(([postRes, commentsRes]) => {
      setPost(postRes.data);
      setLikeCount(postRes.data.likeCount);
      setComments(commentsRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    const res = await api.post(`/posts/${id}/like`);
    setLiked(res.data.liked);
    setLikeCount(res.data.likeCount);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    const res = await api.post('/comments', { postId: parseInt(id), content: newComment });
    setComments(prev => [...prev, res.data]);
    setNewComment('');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    navigate('/');
  };

  const handleDeleteComment = async (commentId) => {
    await api.delete(`/comments/${commentId}`);
    setComments(prev => prev.filter(c => c.commentId !== commentId));
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!post)   return <div style={styles.loading}>Post not found.</div>;

  const isAuthor = user && user.userId === post.authorId;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back link */}
        <Link to="/" style={styles.back}>← Back to posts</Link>

        {/* Post header */}
        <header style={styles.header}>
          {post.categoryName && <span style={styles.badge}>{post.categoryName}</span>}
          <h1 style={styles.title}>{post.title}</h1>
          <div style={styles.meta}>
            By <strong>{post.authorUsername}</strong>
            &nbsp;·&nbsp;
            {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          {isAuthor && (
            <div style={styles.actions}>
              <Link to={`/posts/${id}/edit`} style={styles.editBtn}>Edit</Link>
              <button onClick={handleDelete} style={styles.deleteBtn}>Delete</button>
            </div>
          )}
        </header>

        {/* Post body */}
        <article style={styles.body}>{post.content}</article>

        {/* Like button */}
        <div style={styles.likeRow}>
          <button onClick={handleLike} style={liked ? styles.likeBtnActive : styles.likeBtn}>
            ♥ {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </button>
        </div>

        {/* Comments */}
        <section style={styles.comments}>
          <h3 style={styles.commentsTitle}>{comments.length} Comment{comments.length !== 1 && 's'}</h3>

          {user && (
            <form onSubmit={handleComment} style={styles.commentForm}>
              <textarea
                style={styles.textarea}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows={3}
              />
              <button style={styles.commentBtn} type="submit">Post Comment</button>
            </form>
          )}

          {comments.map(c => (
            <div key={c.commentId} style={styles.comment}>
              <div style={styles.commentHeader}>
                <strong>{c.username}</strong>
                <span style={{ color: '#aaa', fontSize: '0.82rem' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ margin: '0.4rem 0 0', color: '#444' }}>{c.content}</p>
              {user && (user.userId === c.userId || user.role === 'ROLE_ADMIN') && (
                <button
                  style={styles.delComment}
                  onClick={() => handleDeleteComment(c.commentId)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f4f6f8', minHeight: '100vh', padding: '2rem 1rem' },
  container: { maxWidth: '780px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' },
  loading: { textAlign: 'center', padding: '4rem', color: '#888' },
  back: { color: '#888', textDecoration: 'none', fontSize: '0.9rem' },
  header: { marginTop: '1.5rem' },
  badge: { background: '#f0f0f0', color: '#555', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 },
  title: { fontSize: '2rem', margin: '0.75rem 0 0.5rem', color: '#1a1a2e', lineHeight: 1.3 },
  meta: { color: '#888', fontSize: '0.9rem', marginBottom: '1rem' },
  actions: { display: 'flex', gap: '0.75rem', marginTop: '0.5rem' },
  editBtn: { padding: '6px 14px', background: '#1a1a2e', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.88rem' },
  deleteBtn: { padding: '6px 14px', background: 'transparent', color: '#e94560', border: '1px solid #e94560', borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem' },
  body: { lineHeight: 1.8, color: '#333', fontSize: '1.05rem', whiteSpace: 'pre-wrap', borderTop: '1px solid #eee', paddingTop: '1.5rem', marginTop: '1rem' },
  likeRow: { marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' },
  likeBtn: { padding: '8px 20px', background: '#fff', border: '1.5px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '0.95rem', color: '#555' },
  likeBtnActive: { padding: '8px 20px', background: '#ffe0e6', border: '1.5px solid #e94560', borderRadius: '20px', cursor: 'pointer', fontSize: '0.95rem', color: '#e94560', fontWeight: 600 },
  comments: { marginTop: '2.5rem' },
  commentsTitle: { fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '1.25rem' },
  commentForm: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' },
  textarea: { padding: '0.75rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit' },
  commentBtn: { alignSelf: 'flex-end', padding: '8px 18px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  comment: { padding: '1rem 0', borderBottom: '1px solid #f0f0f0' },
  commentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  delComment: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.4rem', padding: 0 },
};

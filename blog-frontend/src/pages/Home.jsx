import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

// useEffect = React hook that runs SIDE EFFECTS (like fetching data from an API).
// It runs after the component renders. The dependency array [] controls when it re-runs.
export default function Home() {
  const [posts, setPosts]           = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(0);
  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();

  const PAGE_SIZE = 6;

  // Fetch categories once on mount
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  // Fetch posts whenever page, search, or category filter changes
  // useEffect re-runs any time a value inside the dependency array changes
  useEffect(() => {
    setLoading(true);
    const params = { status: 'published', page, size: PAGE_SIZE };
    if (search)     params.search = search;
    if (categoryId) params.categoryId = categoryId;

    api.get('/posts', { params })
      .then(res => {
        setPosts(res.data.posts);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  }, [page, search, categoryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0); // reset to first page when searching
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>DevBlog</h1>
        <p style={styles.heroSub}>Tutorials, career advice, and developer stories</p>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            style={styles.searchInput}
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button style={styles.searchBtn} type="submit">Search</button>
        </form>
      </div>

      <div style={styles.content}>
        {/* Category filter sidebar */}
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Categories</h3>
          <button
            style={categoryId === '' ? styles.catBtnActive : styles.catBtn}
            onClick={() => { setCategoryId(''); setPage(0); }}
          >
            All Posts
          </button>
          {categories.map(cat => (
            <button
              key={cat.categoryId}
              style={cat.categoryId === categoryId ? styles.catBtnActive : styles.catBtn}
              onClick={() => { setCategoryId(cat.categoryId); setPage(0); }}
            >
              {cat.name}
            </button>
          ))}
        </aside>

        {/* Post grid */}
        <main style={styles.main}>
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p style={{ color: '#888' }}>No posts found.</p>
          ) : (
            <div style={styles.grid}>
              {posts.map(post => (
                <article
                  key={post.postId}
                  style={styles.card}
                  onClick={() => navigate(`/posts/${post.postId}`)}
                >
                  {post.categoryName && (
                    <span style={styles.badge}>{post.categoryName}</span>
                  )}
                  <h2 style={styles.cardTitle}>{post.title}</h2>
                  <p style={styles.cardSummary}>{post.summary}</p>
                  <div style={styles.cardMeta}>
                    <span>By <strong>{post.authorUsername}</strong></span>
                    <span>{post.likeCount} ♥</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                style={styles.pageBtn}
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
              >
                ← Prev
              </button>
              <span>Page {page + 1} of {totalPages}</span>
              <button
                style={styles.pageBtn}
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f4f6f8' },
  hero: { background: '#1a1a2e', color: '#fff', padding: '4rem 2rem', textAlign: 'center' },
  heroTitle: { fontSize: '3rem', margin: 0, color: '#e94560' },
  heroSub: { color: '#aaa', marginTop: '0.5rem', marginBottom: '1.5rem' },
  searchForm: { display: 'flex', justifyContent: 'center', gap: '0.5rem' },
  searchInput: { padding: '0.65rem 1rem', borderRadius: '8px', border: 'none', width: '320px', fontSize: '1rem' },
  searchBtn: { padding: '0.65rem 1.2rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  content: { display: 'flex', maxWidth: '1100px', margin: '0 auto', padding: '2rem', gap: '2rem' },
  sidebar: { width: '200px', flexShrink: 0 },
  sidebarTitle: { fontSize: '1rem', color: '#555', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  catBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', marginBottom: '0.4rem', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#555', fontSize: '0.95rem' },
  catBtnActive: { display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', marginBottom: '0.4rem', background: '#e94560', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', fontSize: '0.95rem', fontWeight: 600 },
  main: { flex: 1 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.15s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  badge: { background: '#f0f0f0', color: '#555', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 },
  cardTitle: { margin: '0.75rem 0 0.5rem', fontSize: '1.1rem', color: '#1a1a2e', lineHeight: 1.4 },
  cardSummary: { color: '#777', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' },
  cardMeta: { display: 'flex', justifyContent: 'space-between', color: '#999', fontSize: '0.82rem' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem', color: '#555' },
  pageBtn: { padding: '0.5rem 1rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', disabled: { opacity: 0.5 } },
};

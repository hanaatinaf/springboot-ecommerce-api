package com.devblog.data.mysql;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import javax.sql.DataSource;

import org.springframework.stereotype.Component;
import com.devblog.data.PostDao;
import com.devblog.models.Post;

@Component
public class MySqlPostDao implements PostDao {

    private final DataSource dataSource;

    public MySqlPostDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // This query uses a JOIN to get the author's username and category name
    // in a single database round-trip — more efficient than multiple queries.
    // It also builds the WHERE clause dynamically based on which filters are applied.
    @Override
    public List<Post> getAll(String status, Integer categoryId, String search, int page, int size) {
        StringBuilder sql = new StringBuilder(
            "SELECT p.*, u.username AS author_username, c.name AS category_name, " +
            "COALESCE((SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id), 0) AS like_count " +
            "FROM posts p " +
            "JOIN users u ON p.author_id = u.user_id " +
            "LEFT JOIN categories c ON p.category_id = c.category_id " +
            "WHERE 1=1 "
        );

        List<Object> params = new ArrayList<>();

        if (status != null && !status.isBlank()) {
            sql.append("AND p.status = ? ");
            params.add(status);
        }
        if (categoryId != null) {
            sql.append("AND p.category_id = ? ");
            params.add(categoryId);
        }
        if (search != null && !search.isBlank()) {
            // ILIKE = case-insensitive LIKE in PostgreSQL
            sql.append("AND (p.title ILIKE ? OR p.summary ILIKE ?) ");
            params.add("%" + search + "%");
            params.add("%" + search + "%");
        }

        sql.append("ORDER BY p.created_at DESC ");
        // LIMIT + OFFSET = pagination. Page 0 = first page, page 1 = second page, etc.
        sql.append("LIMIT ? OFFSET ?");
        params.add(size);
        params.add(page * size);

        List<Post> posts = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                posts.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching posts", e);
        }
        return posts;
    }

    @Override
    public int countAll(String status, Integer categoryId, String search) {
        StringBuilder sql = new StringBuilder(
            "SELECT COUNT(*) FROM posts p WHERE 1=1 "
        );
        List<Object> params = new ArrayList<>();

        if (status != null && !status.isBlank()) {
            sql.append("AND p.status = ? ");
            params.add(status);
        }
        if (categoryId != null) {
            sql.append("AND p.category_id = ? ");
            params.add(categoryId);
        }
        if (search != null && !search.isBlank()) {
            sql.append("AND (p.title ILIKE ? OR p.summary ILIKE ?) ");
            params.add("%" + search + "%");
            params.add("%" + search + "%");
        }

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            throw new RuntimeException("Error counting posts", e);
        }
        return 0;
    }

    @Override
    public Post getById(int postId) {
        String sql =
            "SELECT p.*, u.username AS author_username, c.name AS category_name, " +
            "COALESCE((SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id), 0) AS like_count " +
            "FROM posts p " +
            "JOIN users u ON p.author_id = u.user_id " +
            "LEFT JOIN categories c ON p.category_id = c.category_id " +
            "WHERE p.post_id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Post post = mapRow(rs);
                post.setTags(getTagsForPost(conn, postId));
                return post;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching post by id", e);
        }
        return null;
    }

    @Override
    public List<Post> getByAuthorId(int authorId) {
        String sql =
            "SELECT p.*, u.username AS author_username, c.name AS category_name, " +
            "COALESCE((SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id), 0) AS like_count " +
            "FROM posts p " +
            "JOIN users u ON p.author_id = u.user_id " +
            "LEFT JOIN categories c ON p.category_id = c.category_id " +
            "WHERE p.author_id = ? " +
            "ORDER BY p.created_at DESC";

        List<Post> posts = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, authorId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) posts.add(mapRow(rs));
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching posts by author", e);
        }
        return posts;
    }

    @Override
    public Post create(Post post) {
        String sql =
            "INSERT INTO posts (title, content, summary, image_url, status, author_id, category_id) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING post_id";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, post.getTitle());
            ps.setString(2, post.getContent());
            ps.setString(3, post.getSummary());
            ps.setString(4, post.getImageUrl());
            ps.setString(5, post.getStatus() != null ? post.getStatus() : "draft");
            ps.setInt(6, post.getAuthorId());
            if (post.getCategoryId() != null) ps.setInt(7, post.getCategoryId());
            else ps.setNull(7, Types.INTEGER);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return getById(rs.getInt("post_id"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error creating post", e);
        }
        return null;
    }

    @Override
    public Post update(int postId, Post post) {
        String sql =
            "UPDATE posts SET title = ?, content = ?, summary = ?, image_url = ?, " +
            "status = ?, category_id = ?, updated_at = NOW() WHERE post_id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, post.getTitle());
            ps.setString(2, post.getContent());
            ps.setString(3, post.getSummary());
            ps.setString(4, post.getImageUrl());
            ps.setString(5, post.getStatus());
            if (post.getCategoryId() != null) ps.setInt(6, post.getCategoryId());
            else ps.setNull(6, Types.INTEGER);
            ps.setInt(7, postId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error updating post", e);
        }
        return getById(postId);
    }

    @Override
    public void delete(int postId) {
        String sql = "DELETE FROM posts WHERE post_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting post", e);
        }
    }

    // Fetches the tag names for a given post using the post_tags junction table
    private List<String> getTagsForPost(Connection conn, int postId) throws SQLException {
        String sql = "SELECT t.name FROM tags t JOIN post_tags pt ON t.tag_id = pt.tag_id WHERE pt.post_id = ?";
        List<String> tags = new ArrayList<>();
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) tags.add(rs.getString("name"));
        }
        return tags;
    }

    private Post mapRow(ResultSet rs) throws SQLException {
        Post post = new Post();
        post.setPostId(rs.getInt("post_id"));
        post.setTitle(rs.getString("title"));
        post.setContent(rs.getString("content"));
        post.setSummary(rs.getString("summary"));
        post.setImageUrl(rs.getString("image_url"));
        post.setStatus(rs.getString("status"));
        post.setAuthorId(rs.getInt("author_id"));
        post.setAuthorUsername(rs.getString("author_username"));
        post.setLikeCount(rs.getInt("like_count"));

        int catId = rs.getInt("category_id");
        if (!rs.wasNull()) post.setCategoryId(catId);
        post.setCategoryName(rs.getString("category_name"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) post.setCreatedAt(createdAt.toLocalDateTime());

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) post.setUpdatedAt(updatedAt.toLocalDateTime());

        post.setTags(Collections.emptyList());
        return post;
    }
}

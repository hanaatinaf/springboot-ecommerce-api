package com.devblog.data.mysql;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import javax.sql.DataSource;

import org.springframework.stereotype.Component;
import com.devblog.data.CommentDao;
import com.devblog.models.Comment;

@Component
public class MySqlCommentDao implements CommentDao {

    private final DataSource dataSource;

    public MySqlCommentDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Comment> getByPostId(int postId) {
        String sql =
            "SELECT c.*, u.username FROM comments c " +
            "JOIN users u ON c.user_id = u.user_id " +
            "WHERE c.post_id = ? ORDER BY c.created_at ASC";

        List<Comment> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching comments", e);
        }
        return list;
    }

    @Override
    public Comment create(Comment comment) {
        String sql = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?) RETURNING comment_id";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, comment.getPostId());
            ps.setInt(2, comment.getUserId());
            ps.setString(3, comment.getContent());
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return getById(rs.getInt("comment_id"));
        } catch (SQLException e) {
            throw new RuntimeException("Error creating comment", e);
        }
        return null;
    }

    @Override
    public Comment getById(int commentId) {
        String sql =
            "SELECT c.*, u.username FROM comments c " +
            "JOIN users u ON c.user_id = u.user_id " +
            "WHERE c.comment_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, commentId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRow(rs);
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching comment", e);
        }
        return null;
    }

    @Override
    public void delete(int commentId) {
        String sql = "DELETE FROM comments WHERE comment_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, commentId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting comment", e);
        }
    }

    private Comment mapRow(ResultSet rs) throws SQLException {
        Comment c = new Comment();
        c.setCommentId(rs.getInt("comment_id"));
        c.setPostId(rs.getInt("post_id"));
        c.setUserId(rs.getInt("user_id"));
        c.setUsername(rs.getString("username"));
        c.setContent(rs.getString("content"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) c.setCreatedAt(ts.toLocalDateTime());
        return c;
    }
}

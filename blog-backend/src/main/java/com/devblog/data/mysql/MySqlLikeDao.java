package com.devblog.data.mysql;

import java.sql.*;
import javax.sql.DataSource;

import org.springframework.stereotype.Component;
import com.devblog.data.LikeDao;

@Component
public class MySqlLikeDao implements LikeDao {

    private final DataSource dataSource;

    public MySqlLikeDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public boolean hasLiked(int postId, int userId) {
        String sql = "SELECT COUNT(*) FROM likes WHERE post_id = ? AND user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ps.setInt(2, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1) > 0;
        } catch (SQLException e) {
            throw new RuntimeException("Error checking like", e);
        }
        return false;
    }

    @Override
    public void addLike(int postId, int userId) {
        // INSERT OR IGNORE pattern: if the UNIQUE constraint fires, do nothing
        String sql = "INSERT INTO likes (post_id, user_id) VALUES (?, ?) ON CONFLICT DO NOTHING";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ps.setInt(2, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error adding like", e);
        }
    }

    @Override
    public void removeLike(int postId, int userId) {
        String sql = "DELETE FROM likes WHERE post_id = ? AND user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ps.setInt(2, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error removing like", e);
        }
    }

    @Override
    public int countLikes(int postId) {
        String sql = "SELECT COUNT(*) FROM likes WHERE post_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            throw new RuntimeException("Error counting likes", e);
        }
        return 0;
    }
}

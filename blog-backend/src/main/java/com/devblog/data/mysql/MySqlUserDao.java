package com.devblog.data.mysql;

import java.sql.*;
import javax.sql.DataSource;

import org.springframework.stereotype.Component;
import com.devblog.data.UserDao;
import com.devblog.models.User;

// @Component tells Spring "create one instance of this class and manage it".
// Spring will automatically inject it wherever UserDao is needed.
@Component
public class MySqlUserDao implements UserDao {

    // DataSource is a connection pool — it efficiently reuses DB connections
    // instead of opening a new one for every single query.
    private final DataSource dataSource;

    public MySqlUserDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // 'try-with-resources' automatically closes the Connection when done,
    // even if an exception occurs — prevents connection leaks.
    @Override
    public User getById(int userId) {
        String sql = "SELECT user_id, username, email, password, role FROM users WHERE user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRow(rs);
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching user by id", e);
        }
        return null;
    }

    @Override
    public User getByUsername(String username) {
        String sql = "SELECT user_id, username, email, password, role FROM users WHERE username = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRow(rs);
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching user by username", e);
        }
        return null;
    }

    @Override
    public User getByEmail(String email) {
        String sql = "SELECT user_id, username, email, password, role FROM users WHERE email = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRow(rs);
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching user by email", e);
        }
        return null;
    }

    @Override
    public User create(User user) {
        // RETURNING user_id is PostgreSQL syntax to get the auto-generated ID
        // back immediately after INSERT — no need for a second SELECT query.
        String sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?) RETURNING user_id";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());   // password is already hashed before calling this
            ps.setString(4, user.getRole());
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                int newId = rs.getInt("user_id");

                // Also create an empty profile row so every user has one
                createEmptyProfile(conn, newId);

                return getById(newId);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error creating user", e);
        }
        return null;
    }

    @Override
    public boolean existsByUsername(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1) > 0;
        } catch (SQLException e) {
            throw new RuntimeException("Error checking username", e);
        }
        return false;
    }

    @Override
    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1) > 0;
        } catch (SQLException e) {
            throw new RuntimeException("Error checking email", e);
        }
        return false;
    }

    // Private helper — creates an empty profile row linked to the new user
    private void createEmptyProfile(Connection conn, int userId) throws SQLException {
        String sql = "INSERT INTO profiles (user_id) VALUES (?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.executeUpdate();
        }
    }

    // mapRow converts a database row (ResultSet) into a User Java object.
    // This is called a "row mapper" — a very common pattern in JDBC code.
    private User mapRow(ResultSet rs) throws SQLException {
        return new User(
            rs.getInt("user_id"),
            rs.getString("username"),
            rs.getString("email"),
            rs.getString("password"),
            rs.getString("role")
        );
    }
}

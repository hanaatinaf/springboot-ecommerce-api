package com.devblog.data.mysql;

import java.sql.*;
import javax.sql.DataSource;

import org.springframework.stereotype.Component;
import com.devblog.data.ProfileDao;
import com.devblog.models.Profile;

@Component
public class MySqlProfileDao implements ProfileDao {

    private final DataSource dataSource;

    public MySqlProfileDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Profile getByUserId(int userId) {
        String sql = "SELECT user_id, first_name, last_name, bio, avatar_url FROM profiles WHERE user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRow(rs);
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching profile", e);
        }
        return null;
    }

    @Override
    public void update(Profile profile) {
        String sql =
            "UPDATE profiles SET first_name = ?, last_name = ?, bio = ?, avatar_url = ? WHERE user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, profile.getFirstName());
            ps.setString(2, profile.getLastName());
            ps.setString(3, profile.getBio());
            ps.setString(4, profile.getAvatarUrl());
            ps.setInt(5, profile.getUserId());
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error updating profile", e);
        }
    }

    private Profile mapRow(ResultSet rs) throws SQLException {
        return new Profile(
            rs.getInt("user_id"),
            rs.getString("first_name"),
            rs.getString("last_name"),
            rs.getString("bio"),
            rs.getString("avatar_url")
        );
    }
}

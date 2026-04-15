package com.devblog.data.mysql;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import javax.sql.DataSource;

import org.springframework.stereotype.Component;
import com.devblog.data.CategoryDao;
import com.devblog.models.Category;

@Component
public class MySqlCategoryDao implements CategoryDao {

    private final DataSource dataSource;

    public MySqlCategoryDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Category> getAll() {
        String sql = "SELECT category_id, name, description FROM categories ORDER BY name";
        List<Category> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching categories", e);
        }
        return list;
    }

    @Override
    public Category getById(int categoryId) {
        String sql = "SELECT category_id, name, description FROM categories WHERE category_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, categoryId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRow(rs);
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching category", e);
        }
        return null;
    }

    @Override
    public Category create(Category category) {
        String sql = "INSERT INTO categories (name, description) VALUES (?, ?) RETURNING category_id";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, category.getName());
            ps.setString(2, category.getDescription());
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return getById(rs.getInt("category_id"));
        } catch (SQLException e) {
            throw new RuntimeException("Error creating category", e);
        }
        return null;
    }

    @Override
    public void update(int categoryId, Category category) {
        String sql = "UPDATE categories SET name = ?, description = ? WHERE category_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, category.getName());
            ps.setString(2, category.getDescription());
            ps.setInt(3, categoryId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error updating category", e);
        }
    }

    @Override
    public void delete(int categoryId) {
        String sql = "DELETE FROM categories WHERE category_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, categoryId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting category", e);
        }
    }

    private Category mapRow(ResultSet rs) throws SQLException {
        return new Category(
            rs.getInt("category_id"),
            rs.getString("name"),
            rs.getString("description")
        );
    }
}

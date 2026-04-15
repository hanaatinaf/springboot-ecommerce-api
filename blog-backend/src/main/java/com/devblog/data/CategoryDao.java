package com.devblog.data;

import java.util.List;
import com.devblog.models.Category;

public interface CategoryDao {
    List<Category> getAll();
    Category getById(int categoryId);
    Category create(Category category);
    void update(int categoryId, Category category);
    void delete(int categoryId);
}

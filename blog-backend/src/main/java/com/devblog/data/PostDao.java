package com.devblog.data;

import java.util.List;
import com.devblog.models.Post;

public interface PostDao {
    List<Post> getAll(String status, Integer categoryId, String search, int page, int size);
    int countAll(String status, Integer categoryId, String search);
    Post getById(int postId);
    List<Post> getByAuthorId(int authorId);
    Post create(Post post);
    Post update(int postId, Post post);
    void delete(int postId);
}

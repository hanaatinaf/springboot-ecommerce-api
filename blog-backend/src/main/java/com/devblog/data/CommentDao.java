package com.devblog.data;

import java.util.List;
import com.devblog.models.Comment;

public interface CommentDao {
    List<Comment> getByPostId(int postId);
    Comment create(Comment comment);
    Comment getById(int commentId);
    void delete(int commentId);
}

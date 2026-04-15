package com.devblog.data;

public interface LikeDao {
    boolean hasLiked(int postId, int userId);
    void addLike(int postId, int userId);
    void removeLike(int postId, int userId);
    int countLikes(int postId);
}

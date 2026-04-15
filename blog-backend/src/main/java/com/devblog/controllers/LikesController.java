package com.devblog.controllers;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.devblog.data.LikeDao;
import com.devblog.data.UserDao;
import com.devblog.models.User;

@RestController
@CrossOrigin
public class LikesController {

    private final LikeDao likeDao;
    private final UserDao userDao;

    public LikesController(LikeDao likeDao, UserDao userDao) {
        this.likeDao = likeDao;
        this.userDao = userDao;
    }

    // POST /posts/{id}/like — toggles like on/off for the logged-in user
    @PostMapping("/posts/{postId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> toggleLike(@PathVariable int postId, Principal principal) {
        User user = userDao.getByUsername(principal.getName());

        boolean alreadyLiked = likeDao.hasLiked(postId, user.getUserId());
        if (alreadyLiked) {
            likeDao.removeLike(postId, user.getUserId());
        } else {
            likeDao.addLike(postId, user.getUserId());
        }

        int newCount = likeDao.countLikes(postId);
        return ResponseEntity.ok(Map.of(
            "liked", !alreadyLiked,
            "likeCount", newCount
        ));
    }

    // GET /posts/{id}/likes/count
    @GetMapping("/posts/{postId}/likes/count")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getLikeCount(@PathVariable int postId) {
        return ResponseEntity.ok(Map.of("likeCount", likeDao.countLikes(postId)));
    }
}

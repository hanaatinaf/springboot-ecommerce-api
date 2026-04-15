package com.devblog.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.devblog.data.CommentDao;
import com.devblog.data.UserDao;
import com.devblog.models.Comment;
import com.devblog.models.User;

@RestController
@RequestMapping("/comments")
@CrossOrigin
public class CommentsController {

    private final CommentDao commentDao;
    private final UserDao userDao;

    public CommentsController(CommentDao commentDao, UserDao userDao) {
        this.commentDao = commentDao;
        this.userDao = userDao;
    }

    @GetMapping("/post/{postId}")
    @PreAuthorize("permitAll()")
    public List<Comment> getByPost(@PathVariable int postId) {
        return commentDao.getByPostId(postId);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Comment> create(@RequestBody Comment comment, Principal principal) {
        User user = userDao.getByUsername(principal.getName());
        comment.setUserId(user.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(commentDao.create(comment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable int id, Principal principal) {
        Comment comment = commentDao.getById(id);
        if (comment == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        User user = userDao.getByUsername(principal.getName());
        boolean isOwner = comment.getUserId() == user.getUserId();
        boolean isAdmin = "ROLE_ADMIN".equals(user.getRole());
        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot delete this comment");
        }

        commentDao.delete(id);
        return ResponseEntity.noContent().build();
    }
}

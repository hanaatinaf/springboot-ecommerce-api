package com.devblog.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.devblog.data.PostDao;
import com.devblog.data.UserDao;
import com.devblog.models.Post;
import com.devblog.models.User;

@RestController
@RequestMapping("/posts")
@CrossOrigin
public class PostsController {

    private final PostDao postDao;
    private final UserDao userDao;

    public PostsController(PostDao postDao, UserDao userDao) {
        this.postDao = postDao;
        this.userDao = userDao;
    }

    // GET /posts?status=published&categoryId=1&search=java&page=0&size=10
    // All parameters are optional — @RequestParam with defaultValue handles missing ones
    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "published") String status,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<Post> posts = postDao.getAll(status, categoryId, search, page, size);
        int total = postDao.countAll(status, categoryId, search);

        // Return both the posts list and the total count (needed for pagination in the UI)
        return ResponseEntity.ok(Map.of(
            "posts", posts,
            "total", total,
            "page", page,
            "size", size,
            "totalPages", (int) Math.ceil((double) total / size)
        ));
    }

    // GET /posts/{id}
    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public Post getById(@PathVariable int id) {
        Post post = postDao.getById(id);
        if (post == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        return post;
    }

    // GET /posts/user/{userId} — all posts by a specific user
    @GetMapping("/user/{userId}")
    @PreAuthorize("permitAll()")
    public List<Post> getByUser(@PathVariable int userId) {
        return postDao.getByAuthorId(userId);
    }

    // POST /posts — create a new post. Principal = the currently logged-in user
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Post> create(@RequestBody Post post, Principal principal) {
        User user = userDao.getByUsername(principal.getName());
        post.setAuthorId(user.getUserId());
        Post created = postDao.create(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /posts/{id} — update a post (only the author or an admin)
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Post update(@PathVariable int id, @RequestBody Post post, Principal principal) {
        Post existing = postDao.getById(id);
        if (existing == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");

        User user = userDao.getByUsername(principal.getName());

        // Authorization check: only the author or admin can update
        boolean isAuthor = existing.getAuthorId() == user.getUserId();
        boolean isAdmin = "ROLE_ADMIN".equals(user.getRole());
        if (!isAuthor && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to edit this post");
        }

        return postDao.update(id, post);
    }

    // DELETE /posts/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable int id, Principal principal) {
        Post existing = postDao.getById(id);
        if (existing == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");

        User user = userDao.getByUsername(principal.getName());
        boolean isAuthor = existing.getAuthorId() == user.getUserId();
        boolean isAdmin = "ROLE_ADMIN".equals(user.getRole());
        if (!isAuthor && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to delete this post");
        }

        postDao.delete(id);
        // 204 No Content = success, but nothing to return
        return ResponseEntity.noContent().build();
    }
}

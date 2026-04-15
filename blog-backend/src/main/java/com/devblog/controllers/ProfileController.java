package com.devblog.controllers;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.devblog.data.ProfileDao;
import com.devblog.data.UserDao;
import com.devblog.models.Profile;
import com.devblog.models.User;

@RestController
@CrossOrigin
public class ProfileController {

    private final ProfileDao profileDao;
    private final UserDao userDao;

    public ProfileController(ProfileDao profileDao, UserDao userDao) {
        this.profileDao = profileDao;
        this.userDao = userDao;
    }

    // GET /profile — logged-in user's own profile
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public Profile getMyProfile(Principal principal) {
        User user = userDao.getByUsername(principal.getName());
        return profileDao.getByUserId(user.getUserId());
    }

    // PUT /profile — update the logged-in user's profile
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public Profile updateMyProfile(@RequestBody Profile profile, Principal principal) {
        User user = userDao.getByUsername(principal.getName());
        profile.setUserId(user.getUserId());   // ensure they can only update their own profile
        profileDao.update(profile);
        return profileDao.getByUserId(user.getUserId());
    }

    // GET /users/{id}/profile — public profile view of any user
    @GetMapping("/users/{userId}/profile")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Profile> getPublicProfile(@PathVariable int userId) {
        Profile profile = profileDao.getByUserId(userId);
        if (profile == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(profile);
    }
}

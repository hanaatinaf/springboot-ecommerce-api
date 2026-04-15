package com.devblog.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.devblog.data.UserDao;
import com.devblog.models.User;

// Spring Security needs a way to load user details by username.
// This service bridges our UserDao (database) with Spring Security.
// When login happens, Spring calls loadUserByUsername() to get the user,
// then compares the provided password with the stored hashed password.
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserDao userDao;

    public UserDetailsServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDao.getByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        // Convert our User model into Spring Security's UserDetails format.
        // The third argument is the list of "authorities" (roles like ROLE_USER, ROLE_ADMIN).
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            List.of(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}

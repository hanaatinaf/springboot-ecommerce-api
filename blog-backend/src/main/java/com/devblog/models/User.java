package com.devblog.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

// A model is a plain Java class that mirrors a database table row.
// This User maps to the 'users' table.
public class User {

    private int userId;
    private String username;
    private String email;

    // @JsonIgnore tells Jackson (the JSON library) to NEVER include
    // the password in API responses — critical security practice.
    @JsonIgnore
    private String password;

    private String role;

    public User() {}

    public User(int userId, String username, String email, String password, String role) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public int getUserId()             { return userId; }
    public void setUserId(int userId)  { this.userId = userId; }

    public String getUsername()                  { return username; }
    public void setUsername(String username)     { this.username = username; }

    public String getEmail()                 { return email; }
    public void setEmail(String email)       { this.email = email; }

    public String getPassword()                  { return password; }
    public void setPassword(String password)     { this.password = password; }

    public String getRole()              { return role; }
    public void setRole(String role)     { this.role = role; }
}

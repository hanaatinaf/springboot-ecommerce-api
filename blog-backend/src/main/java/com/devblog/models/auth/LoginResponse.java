package com.devblog.models.auth;

// This is what we send BACK to the client after a successful login.
// The client will store this JWT token and attach it to every future request.
public class LoginResponse {
    private String token;
    private String username;
    private int userId;
    private String role;

    public LoginResponse(String token, String username, int userId, String role) {
        this.token = token;
        this.username = username;
        this.userId = userId;
        this.role = role;
    }

    public String getToken()             { return token; }
    public String getUsername()          { return username; }
    public int getUserId()               { return userId; }
    public String getRole()              { return role; }
}

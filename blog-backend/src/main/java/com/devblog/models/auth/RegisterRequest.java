package com.devblog.models.auth;

// DTO = Data Transfer Object.
// This represents only the JSON body we expect when a user registers.
// It's separate from the User model because we don't want to expose
// all User fields in the registration endpoint.
public class RegisterRequest {
    private String username;
    private String email;
    private String password;

    public String getUsername()                  { return username; }
    public void setUsername(String username)     { this.username = username; }

    public String getEmail()                 { return email; }
    public void setEmail(String email)       { this.email = email; }

    public String getPassword()                  { return password; }
    public void setPassword(String password)     { this.password = password; }
}

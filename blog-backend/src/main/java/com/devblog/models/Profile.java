package com.devblog.models;

public class Profile {

    private int userId;
    private String firstName;
    private String lastName;
    private String bio;
    private String avatarUrl;

    public Profile() {}

    public Profile(int userId, String firstName, String lastName, String bio, String avatarUrl) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }

    public int getUserId()              { return userId; }
    public void setUserId(int userId)   { this.userId = userId; }

    public String getFirstName()                     { return firstName; }
    public void setFirstName(String firstName)       { this.firstName = firstName; }

    public String getLastName()                      { return lastName; }
    public void setLastName(String lastName)         { this.lastName = lastName; }

    public String getBio()               { return bio; }
    public void setBio(String bio)       { this.bio = bio; }

    public String getAvatarUrl()                     { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl)       { this.avatarUrl = avatarUrl; }
}

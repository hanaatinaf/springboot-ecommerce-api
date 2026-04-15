package com.devblog.models;

import java.time.LocalDateTime;
import java.util.List;

// Post maps to the 'posts' table.
// Notice it also holds authorUsername and categoryName — these come from JOINs
// so we don't have to make a second database call just to show the author's name.
public class Post {

    private int postId;
    private String title;
    private String content;
    private String summary;
    private String imageUrl;
    private String status;          // "draft" or "published"
    private int authorId;
    private String authorUsername;  // from JOIN with users table
    private Integer categoryId;
    private String categoryName;    // from JOIN with categories table
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likeCount;          // computed from COUNT on likes table
    private List<String> tags;      // from JOIN with tags/post_tags tables

    public Post() {}

    public int getPostId()               { return postId; }
    public void setPostId(int postId)    { this.postId = postId; }

    public String getTitle()             { return title; }
    public void setTitle(String title)   { this.title = title; }

    public String getContent()               { return content; }
    public void setContent(String content)   { this.content = content; }

    public String getSummary()               { return summary; }
    public void setSummary(String summary)   { this.summary = summary; }

    public String getImageUrl()                  { return imageUrl; }
    public void setImageUrl(String imageUrl)     { this.imageUrl = imageUrl; }

    public String getStatus()                { return status; }
    public void setStatus(String status)     { this.status = status; }

    public int getAuthorId()                 { return authorId; }
    public void setAuthorId(int authorId)    { this.authorId = authorId; }

    public String getAuthorUsername()                        { return authorUsername; }
    public void setAuthorUsername(String authorUsername)     { this.authorUsername = authorUsername; }

    public Integer getCategoryId()                   { return categoryId; }
    public void setCategoryId(Integer categoryId)    { this.categoryId = categoryId; }

    public String getCategoryName()                      { return categoryName; }
    public void setCategoryName(String categoryName)     { this.categoryName = categoryName; }

    public LocalDateTime getCreatedAt()                      { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)        { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt()                      { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)        { this.updatedAt = updatedAt; }

    public int getLikeCount()                    { return likeCount; }
    public void setLikeCount(int likeCount)      { this.likeCount = likeCount; }

    public List<String> getTags()            { return tags; }
    public void setTags(List<String> tags)   { this.tags = tags; }
}

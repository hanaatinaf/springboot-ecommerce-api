-- DevBlog Database Schema
-- Run this once to set up all tables before starting the app.
-- PostgreSQL syntax

-- Drop tables in reverse dependency order (so foreign keys don't block drops)
DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

-- USERS: stores login credentials
-- 'SERIAL' = auto-incrementing integer (PostgreSQL equivalent of AUTO_INCREMENT in MySQL)
CREATE TABLE users (
    user_id   SERIAL PRIMARY KEY,
    username  VARCHAR(50)  NOT NULL UNIQUE,
    email     VARCHAR(100) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,   -- always store hashed passwords, never plain text
    role      VARCHAR(20)  NOT NULL DEFAULT 'ROLE_USER'
);

-- PROFILES: extra info about a user, stored separately so users table stays clean
CREATE TABLE profiles (
    user_id    INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(50),
    last_name  VARCHAR(50),
    bio        TEXT,
    avatar_url VARCHAR(255)
);

-- CATEGORIES: organizes posts into topics (e.g. "Technology", "Career")
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- POSTS: the main content of the blog
CREATE TABLE posts (
    post_id     SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    content     TEXT         NOT NULL,
    summary     VARCHAR(500),                                          -- short preview shown on cards
    image_url   VARCHAR(255),
    status      VARCHAR(20)  NOT NULL DEFAULT 'draft',                 -- 'draft' or 'published'
    author_id   INT          NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INT          REFERENCES categories(category_id) ON DELETE SET NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- COMMENTS: users comment on posts
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id    INT  NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id    INT  NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content    TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- LIKES: one like per user per post (enforced by UNIQUE constraint)
CREATE TABLE likes (
    like_id    SERIAL PRIMARY KEY,
    post_id    INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id    INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (post_id, user_id)  -- prevents a user from liking the same post twice
);

-- TAGS: keywords for posts (e.g. "java", "spring", "beginners")
CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    name   VARCHAR(50) NOT NULL UNIQUE
);

-- POST_TAGS: joins posts and tags — this is a many-to-many relationship
-- One post can have many tags; one tag can be on many posts
CREATE TABLE post_tags (
    post_id INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    tag_id  INT NOT NULL REFERENCES tags(tag_id)  ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)  -- composite primary key prevents duplicates
);

-- Seed data: default categories so the app has content to browse
INSERT INTO categories (name, description) VALUES
    ('Technology',  'Posts about software, tools, and tech trends'),
    ('Career',      'Job hunting, interviews, and career advice'),
    ('Tutorial',    'Step-by-step coding guides'),
    ('Opinion',     'Developer thoughts and perspectives');

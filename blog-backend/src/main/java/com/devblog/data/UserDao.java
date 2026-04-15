package com.devblog.data;

import com.devblog.models.User;

// This is an INTERFACE — it defines WHAT operations are possible on users
// without saying HOW they are done. The "MySqlUserDao" class will contain
// the actual SQL. This separation makes it easy to swap databases later.
public interface UserDao {
    User getById(int userId);
    User getByUsername(String username);
    User getByEmail(String email);
    User create(User user);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}

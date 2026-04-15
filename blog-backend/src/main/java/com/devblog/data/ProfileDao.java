package com.devblog.data;

import com.devblog.models.Profile;

public interface ProfileDao {
    Profile getByUserId(int userId);
    void update(Profile profile);
}

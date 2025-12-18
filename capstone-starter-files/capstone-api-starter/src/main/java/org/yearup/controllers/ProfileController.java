package org.yearup.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.yearup.data.ProfileDao;
import org.yearup.data.UserDao;
import org.yearup.models.Profile;
import org.yearup.models.User;

@RestController
@RequestMapping("profile")
@CrossOrigin
public class ProfileController
{
    private final ProfileDao profileDao;
    private final UserDao userDao;

    @Autowired
    public ProfileController(ProfileDao profileDao, UserDao userDao)
    {
        this.profileDao = profileDao;
        this.userDao = userDao;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public Profile getProfile(Principal principal)
    {
        try
        {
            User user = userDao.getByUserName(principal.getName());
            if (user == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

            Profile profile = profileDao.getByUserId(user.getId());
            if (profile == null)
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);

            return profile;
        }
        catch (ResponseStatusException ex)
        {
            throw ex;
        }
        catch (Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public Profile updateProfile(@RequestBody Profile profile, Principal principal)
    {
        try
        {
            User user = userDao.getByUserName(principal.getName());
            if (user == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

            profile.setUserId(user.getId());

            if (profileDao.getByUserId(user.getId()) == null)
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);

            profileDao.update(profile);
            return profileDao.getByUserId(user.getId());
        }
        catch (ResponseStatusException ex)
        {
            throw ex;
        }
        catch (Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }
}

package com.devblog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication = the entry point annotation.
// It tells Spring to scan this package and all sub-packages for components to load.
@SpringBootApplication
public class DevBlogApplication {
    public static void main(String[] args) {
        SpringApplication.run(DevBlogApplication.class, args);
    }
}

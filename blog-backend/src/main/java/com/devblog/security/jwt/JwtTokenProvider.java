package com.devblog.security.jwt;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

// This class is responsible for:
// 1. CREATING a JWT token after login
// 2. VALIDATING a JWT token on each request
// 3. EXTRACTING the username from a token

@Component
public class JwtTokenProvider {

    // These values come from application.properties — keeps secrets out of code
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private int jwtExpirationMs;

    // Creates the signing key from our secret string
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Called after successful login to generate a token
    // The token contains: who the user is (subject) + when it expires
    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())       // stores username inside the token
                .setIssuedAt(new Date())                        // when was it created
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))  // when does it expire
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)  // cryptographically sign it
                .compact();
    }

    // Extracts the username stored inside the token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Returns true if the token's signature is valid and it hasn't expired
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}

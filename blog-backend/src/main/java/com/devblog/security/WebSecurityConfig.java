package com.devblog.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.devblog.security.jwt.JwtAuthFilter;
import com.devblog.security.jwt.JwtTokenProvider;

import java.util.List;

// @Configuration means: this class provides Spring "beans" (managed objects)
// @EnableWebSecurity: activates Spring Security
// @EnableMethodSecurity: allows @PreAuthorize annotations on individual methods
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsServiceImpl userDetailsService;

    public WebSecurityConfig(JwtTokenProvider tokenProvider, UserDetailsServiceImpl userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    // BCrypt is the industry-standard algorithm for hashing passwords.
    // When a user registers, we hash their password with this.
    // When they log in, Spring compares the provided password against the hash.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager is what Spring uses to actually authenticate (log in) a user
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // This is the main security configuration — it defines which endpoints need auth
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF: not needed for stateless REST APIs using JWT
            .csrf(csrf -> csrf.disable())

            // Configure CORS so our React frontend (on a different port) can call the API
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // STATELESS means: don't create HTTP sessions. Each request must carry its JWT.
            // This is the correct approach for REST APIs.
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                // Public endpoints — no token needed
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/posts/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/comments/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/users/**").permitAll()

                // Everything else requires a valid JWT token
                .anyRequest().authenticated()
            )

            // Add our JWT filter BEFORE Spring's default login filter.
            // This means every request goes through JWT validation first.
            .addFilterBefore(new JwtAuthFilter(tokenProvider, userDetailsService),
                             UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS = Cross-Origin Resource Sharing.
    // This allows our React app (localhost:5173) to call our API (localhost:8080).
    // Without this, browsers block cross-origin requests by default.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

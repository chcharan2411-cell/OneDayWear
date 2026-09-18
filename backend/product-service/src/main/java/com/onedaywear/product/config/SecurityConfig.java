package com.onedaywear.product.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.onedaywear.product.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

            	// Public image files
                .requestMatchers("/uploads/**").permitAll()
                // Public APIs
                .requestMatchers(HttpMethod.GET, "/products/**").permitAll()

                .requestMatchers(HttpMethod.POST,
                        "/products/*/upload-image").permitAll()
                // Admin Only APIs
                .requestMatchers(HttpMethod.POST, "/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,
                        "/products/*/decrease-stock").permitAll()

                .requestMatchers(HttpMethod.PUT,
                        "/products/*/increase-stock").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class)

            .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }
}
package com.onedaywear.order.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.onedaywear.order.security.JwtAuthenticationFilter;

import jakarta.annotation.PostConstruct;

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

                // User APIss
            		.requestMatchers(HttpMethod.POST, "/orders").hasRole("USER")
            		.requestMatchers(HttpMethod.GET, "/orders/my-orders").hasRole("USER")

            		.requestMatchers(HttpMethod.GET, "/orders/*").permitAll()
            		.requestMatchers(HttpMethod.GET, "/orders").hasRole("ADMIN")
            		.requestMatchers(HttpMethod.PUT, "/orders/**").permitAll()
            		.requestMatchers(HttpMethod.DELETE, "/orders/**").hasRole("ADMIN")

            		.anyRequest().authenticated()
            )

            .addFilterBefore(jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class)

            .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }
    
    
}
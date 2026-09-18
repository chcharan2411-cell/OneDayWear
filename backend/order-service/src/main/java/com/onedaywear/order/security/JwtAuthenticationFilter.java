package com.onedaywear.order.security;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        System.out.println("================================");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Authorization Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Authorization header missing");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        System.out.println("JWT Received");

        try {

            if (jwtUtil.isTokenValid(token)) {

            	String username = jwtUtil.extractUsername(token);
            	String role = jwtUtil.extractRole(token);

            	System.out.println("User : " + username);
            	System.out.println("Role : " + role);

            	UsernamePasswordAuthenticationToken authentication =
            	        UsernamePasswordAuthenticationToken.authenticated(
            	                username,
            	                null,
            	                List.of(new SimpleGrantedAuthority("ROLE_" + role))
            	        );

            	authentication.setDetails(
            	        new WebAuthenticationDetailsSource()
            	                .buildDetails(request));

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception e) {

            System.out.println("JWT ERROR : " + e.getMessage());
            e.printStackTrace();

        }

        filterChain.doFilter(request, response);
    }
}
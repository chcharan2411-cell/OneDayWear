package com.onedaywear.auth.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.onedaywear.auth.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil,
                                   CustomUserDetailsService userDetailsService) {

        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

    	String authHeader = request.getHeader("Authorization");

    	if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    	    filterChain.doFilter(request, response);
    	    return;
    	}

    	try {

    	    String token = authHeader.substring(7);

    	    String email = jwtUtil.extractEmail(token);

    	    if (email != null
    	            && SecurityContextHolder.getContext().getAuthentication() == null) {

    	        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

    	        if (jwtUtil.validateToken(token)) {

    	            UsernamePasswordAuthenticationToken authentication =
    	                    new UsernamePasswordAuthenticationToken(
    	                            userDetails,
    	                            null,
    	                            userDetails.getAuthorities());

    	            authentication.setDetails(
    	                    new WebAuthenticationDetailsSource().buildDetails(request));

    	            SecurityContextHolder.getContext().setAuthentication(authentication);
    	        }
    	    }

    	} catch (Exception e) {
    	    // Invalid token, continue without authentication
    	}

    	filterChain.doFilter(request, response);
    	}
}
package com.onedaywear.auth.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.onedaywear.auth.dto.ChangePasswordRequest;
import com.onedaywear.auth.dto.LoginRequest;
import com.onedaywear.auth.dto.LoginResponse;
import com.onedaywear.auth.dto.RegisterRequest;
import com.onedaywear.auth.dto.RegisterResponse;
import com.onedaywear.auth.dto.RegisterVerifyRequest;
import com.onedaywear.auth.dto.UpdateRoleRequest;
import com.onedaywear.auth.dto.UserProfileResponse;
import com.onedaywear.auth.dto.UserResponse;
import com.onedaywear.auth.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        RegisterResponse response =
                authService.register(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.OK);
    }

    @PostMapping("/register/verify")
    public ResponseEntity<RegisterResponse> verifyRegistrationOtp(
            @Valid @RequestBody RegisterVerifyRequest request) {

        RegisterResponse response =
                authService.verifyRegistrationOtp(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            Principal principal) {

        UserProfileResponse response =
                authService.getProfile(principal.getName());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                authService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                authService.getUserById(id));
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoleRequest request) {

        return ResponseEntity.ok(
                authService.updateUserRole(id, request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<RegisterResponse> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {

        authService.changePassword(
                userDetails.getUsername(),
                request);

        return ResponseEntity.ok(
                new RegisterResponse(
                        "Password Changed Successfully"));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {

        return ResponseEntity.ok(
                authService.getUserCount());
    }
}
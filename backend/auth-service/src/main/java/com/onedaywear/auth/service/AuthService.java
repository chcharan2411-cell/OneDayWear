package com.onedaywear.auth.service;

import java.util.List;

import com.onedaywear.auth.dto.ChangePasswordRequest;
import com.onedaywear.auth.dto.LoginRequest;
import com.onedaywear.auth.dto.LoginResponse;
import com.onedaywear.auth.dto.RegisterRequest;
import com.onedaywear.auth.dto.RegisterResponse;
import com.onedaywear.auth.dto.RegisterVerifyRequest;
import com.onedaywear.auth.dto.UpdateRoleRequest;
import com.onedaywear.auth.dto.UserProfileResponse;
import com.onedaywear.auth.dto.UserResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    RegisterResponse verifyRegistrationOtp(
            RegisterVerifyRequest request);
    
    LoginResponse login(LoginRequest request);

    UserProfileResponse getProfile(String email);

    List<UserResponse> getAllUsers();
    
    UserResponse getUserById(Long id);

    UserResponse updateUserRole(Long id, UpdateRoleRequest request);
    
    void changePassword(String email, ChangePasswordRequest request);
    
    Long getUserCount();
    
}
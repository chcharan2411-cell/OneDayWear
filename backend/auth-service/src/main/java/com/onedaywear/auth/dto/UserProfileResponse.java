package com.onedaywear.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserProfileResponse {

    private String fullName;
    private String email;
    private String phoneNumber;
    private String role;

}
package com.onedaywear.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {

    private String message;
    private String otp;

    public RegisterResponse(String message) {
        this.message = message;
    }
}
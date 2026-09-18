package com.onedaywear.admin.client;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.onedaywear.admin.config.FeignAuthConfig;

@FeignClient(
        name = "AUTH-SERVICE",
        configuration = FeignAuthConfig.class
)
public interface AuthClient {

    @GetMapping("/auth/count")
    Long getUserCount();

    @GetMapping("/auth/users")
    List<Map<String, Object>> getAllUsers();
}
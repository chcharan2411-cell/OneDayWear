package com.onedaywear.admin.config;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignAuthConfig {

    private static final ThreadLocal<String> AUTH_TOKEN_HOLDER = new ThreadLocal<>();

    public static void setAuthToken(String token) {
        AUTH_TOKEN_HOLDER.set(token);
    }

    public static void clearAuthToken() {
        AUTH_TOKEN_HOLDER.remove();
    }

    @Bean
    public RequestInterceptor requestInterceptor() {

        return requestTemplate -> {

            String directToken = AUTH_TOKEN_HOLDER.get();
            if (directToken != null && !directToken.isBlank()) {
                requestTemplate.header("Authorization", directToken);
                return;
            }

            try {
                ServletRequestAttributes attributes =
                        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

                if (attributes != null) {
                    HttpServletRequest request = attributes.getRequest();
                    String authorization = request.getHeader("Authorization");

                    if (authorization != null && !authorization.isBlank()) {
                        requestTemplate.header("Authorization", authorization);
                    }
                }
            } catch (Exception ignored) {
            }
        };
    }

    @Bean
    public feign.Request.Options requestOptions() {
        return new feign.Request.Options(
                3000, java.util.concurrent.TimeUnit.MILLISECONDS,
                3000, java.util.concurrent.TimeUnit.MILLISECONDS,
                true
        );
    }
}
package com.onedaywear.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class NotificationClientConfig {

    @Bean
    public RestClient notificationRestClient() {

        return RestClient.builder()
                .baseUrl("http://localhost:8080")
                .build();
    }
}
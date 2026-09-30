package com.onedaywear.auth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class NotificationClientConfig {

    @Bean
    public RestClient notificationRestClient(
            @Value("${NOTIFICATION_SERVICE_URL:${notification.service.url:http://notification-service:8085}}") String notificationUrl) {

        return RestClient.builder()
                .baseUrl(notificationUrl)
                .build();
    }
}
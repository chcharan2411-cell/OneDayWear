package com.onedaywear.auth.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.onedaywear.auth.dto.NotificationRequest;

@Component
public class NotificationClient {

    private final RestClient notificationRestClient;

    public NotificationClient(RestClient notificationRestClient) {
        this.notificationRestClient = notificationRestClient;
    }

    public void sendEmail(NotificationRequest request) {

        notificationRestClient
                .post()
                .uri("/notifications/send")
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }
}
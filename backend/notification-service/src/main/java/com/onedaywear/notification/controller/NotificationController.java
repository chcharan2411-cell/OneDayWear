package com.onedaywear.notification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.onedaywear.notification.dto.NotificationRequest;
import com.onedaywear.notification.service.NotificationService;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(
            @RequestBody NotificationRequest request) {

        notificationService.sendEmail(request);

        return ResponseEntity.ok("Email Sent Successfully");
    }
}
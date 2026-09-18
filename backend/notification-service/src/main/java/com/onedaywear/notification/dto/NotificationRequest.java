package com.onedaywear.notification.dto;

import com.onedaywear.notification.enums.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    private String to;

    private String customerName;

    private Long orderId;

    private String otp;
    
    private NotificationType notificationType;
}
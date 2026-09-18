package com.onedaywear.payment.dto;

import com.onedaywear.payment.entity.NotificationType;

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
    private NotificationType notificationType;
}

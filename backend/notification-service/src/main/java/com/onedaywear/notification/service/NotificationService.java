package com.onedaywear.notification.service;

import com.onedaywear.notification.dto.NotificationRequest;

public interface NotificationService {

    void sendEmail(NotificationRequest request);
}
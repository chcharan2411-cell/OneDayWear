package com.onedaywear.notification.service.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.onedaywear.notification.dto.NotificationRequest;
import com.onedaywear.notification.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender mailSender;

    public NotificationServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendEmail(NotificationRequest request) {

        String subject = "";
        String body = "";

        switch (request.getNotificationType()) {

            case ORDER_CONFIRMATION -> {
                subject = "Order Confirmed - One Day Wear";
                body = """
                        Hello %s,

                        Your order has been placed successfully.

                        Order ID : %d

                        Thank you for choosing One Day Wear.

                        Happy Shopping!
                        """
                        .formatted(request.getCustomerName(),
                                   request.getOrderId());
            }

            case PAYMENT_SUCCESS -> {
                subject = "Payment Successful - One Day Wear";
                body = """
                        Hello %s,

                        Your payment was successful.

                        Order ID : %d

                        Thank you for your payment.
                        """
                        .formatted(request.getCustomerName(),
                                   request.getOrderId());
            }

            case PAYMENT_REFUND -> {
                subject = "Payment Refunded - One Day Wear";
                body = """
                        Hello %s,

                        Your refund has been processed successfully.

                        Order ID : %d
                        """
                        .formatted(request.getCustomerName(),
                                   request.getOrderId());
            }

            case ORDER_RETURNED -> {
                subject = "Order Returned - One Day Wear";
                body = """
                        Hello %s,

                        Your rented outfit has been returned successfully.

                        Order ID : %d

                        Thank you for using One Day Wear.
                        """
                        .formatted(request.getCustomerName(),
                                   request.getOrderId());
            }
            
            case EMAIL_VERIFICATION_OTP -> {
                subject = "Verify Your Email - One Day Wear";

                body = """
                        Hello %s,

                        Welcome to One Day Wear!

                        Your email verification OTP is:

                        %s

                        This OTP is valid for 5 minutes.

                        Please do not share this OTP with anyone.

                        If you did not request this verification,
                        you can safely ignore this email.

                        Thank you,
                        One Day Wear
                        """
                        .formatted(
                                request.getCustomerName(),
                                request.getOtp()
                        );
            }
        }

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(request.getTo());
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
package com.onedaywear.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.onedaywear.payment.entity.PaymentMethod;
import com.onedaywear.payment.entity.PaymentStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;

    private Long orderId;

    private BigDecimal amount;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private LocalDateTime paymentDate;

    private String razorpayOrderId;

    private String razorpayPaymentId;
}
package com.onedaywear.payment.dto;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderResponse {

    private String razorpayOrderId;

    private Long orderId;

    private BigDecimal amount;

    private String currency;

    private String keyId;
}
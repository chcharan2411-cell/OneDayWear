package com.onedaywear.payment.service;

import com.onedaywear.payment.dto.PaymentResponse;
import com.onedaywear.payment.dto.RazorpayOrderResponse;
import com.onedaywear.payment.dto.RazorpayVerifyRequest;

public interface PaymentService {

    RazorpayOrderResponse createRazorpayOrder(
            Long orderId);

    PaymentResponse verifyRazorpayPayment(
            RazorpayVerifyRequest request);

    PaymentResponse getPaymentById(
            Long id);

    PaymentResponse getPaymentByOrderId(
            Long orderId);

    PaymentResponse refundPayment(
            Long paymentId);

    Long getPaymentCount();
}
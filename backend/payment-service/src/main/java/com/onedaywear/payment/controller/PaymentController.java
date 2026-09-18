package com.onedaywear.payment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.onedaywear.payment.dto.PaymentResponse;
import com.onedaywear.payment.dto.RazorpayOrderResponse;
import com.onedaywear.payment.dto.RazorpayVerifyRequest;
import com.onedaywear.payment.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/payments")
@Validated
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(
            PaymentService paymentService) {

        this.paymentService = paymentService;
    }

    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    @PostMapping("/razorpay/order/{orderId}")
    public ResponseEntity<RazorpayOrderResponse>
    createRazorpayOrder(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                paymentService.createRazorpayOrder(
                        orderId));
    }

    // ==========================================
    // VERIFY RAZORPAY PAYMENT
    // ==========================================

    @PostMapping("/razorpay/verify")
    public ResponseEntity<PaymentResponse>
    verifyRazorpayPayment(
            @Valid @RequestBody
            RazorpayVerifyRequest request) {

        return ResponseEntity.ok(
                paymentService.verifyRazorpayPayment(
                        request));
    }

    // ==========================================
    // GET PAYMENT BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse>
    getPaymentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentService.getPaymentById(id));
    }

    // ==========================================
    // GET PAYMENT BY ORDER
    // ==========================================

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse>
    getPaymentByOrderId(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                paymentService.getPaymentByOrderId(
                        orderId));
    }

    // ==========================================
    // REFUND
    // ==========================================

    @PutMapping("/{id}/refund")
    public ResponseEntity<PaymentResponse>
    refundPayment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentService.refundPayment(id));
    }

    // ==========================================
    // COUNT
    // ==========================================

    @GetMapping("/count")
    public ResponseEntity<Long> getPaymentCount() {

        return ResponseEntity.ok(
                paymentService.getPaymentCount());
    }
}
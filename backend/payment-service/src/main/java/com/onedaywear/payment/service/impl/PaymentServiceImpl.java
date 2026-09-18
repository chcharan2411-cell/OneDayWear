package com.onedaywear.payment.service.impl;

import java.math.BigDecimal;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import com.onedaywear.payment.client.InventoryClient;
import com.onedaywear.payment.client.NotificationClient;
import com.onedaywear.payment.client.OrderClient;

import com.onedaywear.payment.dto.NotificationRequest;
import com.onedaywear.payment.dto.OrderResponse;
import com.onedaywear.payment.dto.PaymentResponse;
import com.onedaywear.payment.dto.RazorpayOrderResponse;
import com.onedaywear.payment.dto.RazorpayVerifyRequest;
import com.onedaywear.payment.dto.StockUpdateRequest;

import com.onedaywear.payment.entity.NotificationType;
import com.onedaywear.payment.entity.Payment;
import com.onedaywear.payment.entity.PaymentMethod;
import com.onedaywear.payment.entity.PaymentStatus;

import com.onedaywear.payment.exception.PaymentAlreadyExistsException;
import com.onedaywear.payment.exception.PaymentAlreadyRefundedException;
import com.onedaywear.payment.exception.PaymentNotFoundException;

import com.onedaywear.payment.repository.PaymentRepository;
import com.onedaywear.payment.service.PaymentService;

@Service
public class PaymentServiceImpl
        implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;
    private final NotificationClient notificationClient;
    private final InventoryClient inventoryClient;

    private final RazorpayClient razorpayClient;
    private final String razorpayKeyId;
    private final String razorpayKeySecret;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            OrderClient orderClient,
            NotificationClient notificationClient,
            InventoryClient inventoryClient,
            RazorpayClient razorpayClient,
            @org.springframework.beans.factory.annotation.Qualifier("razorpayKeyId")
            String razorpayKeyId,
            @org.springframework.beans.factory.annotation.Qualifier("razorpayKeySecret")
            String razorpayKeySecret) {

        this.paymentRepository = paymentRepository;
        this.orderClient = orderClient;
        this.notificationClient = notificationClient;
        this.inventoryClient = inventoryClient;

        this.razorpayClient = razorpayClient;
        this.razorpayKeyId = razorpayKeyId;
        this.razorpayKeySecret = razorpayKeySecret;
    }

    // =========================================================
    // CREATE RAZORPAY ORDER
    // =========================================================

    @Override
    public RazorpayOrderResponse createRazorpayOrder(
            Long orderId) {

        OrderResponse order =
                orderClient.getOrderById(orderId);

        if (order == null) {

            throw new PaymentNotFoundException(
                    "Order not found");
        }

        paymentRepository
                .findByOrderId(orderId)
                .ifPresent(payment -> {

                    if (payment.getPaymentStatus()
                            == PaymentStatus.SUCCESS) {

                        throw new PaymentAlreadyExistsException(
                                "Payment already completed for this order");
                    }
                });

        BigDecimal amount =
                order.getTotalAmount();

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Invalid payment amount");
        }

        long amountInPaise =
                amount
                        .multiply(
                                BigDecimal.valueOf(100))
                        .longValueExact();

        try {

            JSONObject orderRequest =
                    new JSONObject();

            orderRequest.put(
                    "amount",
                    amountInPaise);

            orderRequest.put(
                    "currency",
                    "INR");

            orderRequest.put(
                    "receipt",
                    "order_" + orderId);

            JSONObject notes =
                    new JSONObject();

            notes.put(
                    "onedaywear_order_id",
                    orderId);

            orderRequest.put(
                    "notes",
                    notes);

            com.razorpay.Order razorpayOrder =
                    razorpayClient.orders.create(
                            orderRequest);

            return RazorpayOrderResponse
                    .builder()
                    .razorpayOrderId(
                            razorpayOrder.get("id"))
                    .orderId(orderId)
                    .amount(amount)
                    .currency("INR")
                    .keyId(razorpayKeyId)
                    .build();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to create Razorpay order: "
                            + e.getMessage(),
                    e);
        }
    }

    // =========================================================
    // VERIFY RAZORPAY PAYMENT
    // =========================================================

    @Override
    @Transactional
    public PaymentResponse verifyRazorpayPayment(
            RazorpayVerifyRequest request) {

        // -----------------------------------------------------
        // BASIC VALIDATION
        // -----------------------------------------------------

        if (request == null) {

            throw new IllegalArgumentException(
                    "Payment verification request is required");
        }

        // -----------------------------------------------------
        // VERIFY RAZORPAY SIGNATURE
        // -----------------------------------------------------

        try {

            JSONObject options =
                    new JSONObject();

            options.put(
                    "razorpay_order_id",
                    request.getRazorpayOrderId());

            options.put(
                    "razorpay_payment_id",
                    request.getRazorpayPaymentId());

            options.put(
                    "razorpay_signature",
                    request.getRazorpaySignature());

            boolean verified =
                    Utils.verifyPaymentSignature(
                            options,
                            razorpayKeySecret);

            if (!verified) {

                throw new IllegalArgumentException(
                        "Invalid Razorpay payment signature");
            }

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Razorpay payment verification failed",
                    e);
        }

        // -----------------------------------------------------
        // FETCH OUR ORDER
        // -----------------------------------------------------

        OrderResponse order =
                orderClient.getOrderById(
                        request.getOrderId());

        if (order == null) {

            throw new PaymentNotFoundException(
                    "Order not found");
        }

        // -----------------------------------------------------
        // CHECK DUPLICATE PAYMENT
        // -----------------------------------------------------

        Payment existingPayment =
                paymentRepository
                        .findByOrderId(
                                request.getOrderId())
                        .orElse(null);

        if (existingPayment != null &&
                existingPayment.getPaymentStatus()
                        == PaymentStatus.SUCCESS) {

            throw new PaymentAlreadyExistsException(
                    "Payment already completed for this order");
        }

        // -----------------------------------------------------
        // CHECK PAYMENT AMOUNT
        // -----------------------------------------------------

        BigDecimal orderAmount =
                order.getTotalAmount();

        if (orderAmount == null ||
                orderAmount.compareTo(
                        BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Invalid order amount");
        }

        // -----------------------------------------------------
        // CREATE PAYMENT
        // -----------------------------------------------------

        Payment payment;

        if (existingPayment != null) {

            payment = existingPayment;

        } else {

            payment = new Payment();
        }

        payment.setOrderId(
                order.getId());

        payment.setAmount(
                orderAmount);

        payment.setPaymentMethod(
                PaymentMethod.UPI);

        payment.setPaymentStatus(
                PaymentStatus.SUCCESS);

        payment.setRazorpayOrderId(
                request.getRazorpayOrderId());

        payment.setRazorpayPaymentId(
                request.getRazorpayPaymentId());

        payment.setRazorpaySignature(
                request.getRazorpaySignature());

        Payment savedPayment =
                paymentRepository.save(payment);

        // -----------------------------------------------------
        // DEDUCT INVENTORY
        // -----------------------------------------------------

        inventoryClient.deductStock(
                StockUpdateRequest
                        .builder()
                        .productId(
                                order.getProductId())
                        .quantity(
                                order.getQuantity())
                        .build());

        // -----------------------------------------------------
        // CONFIRM ORDER
        // -----------------------------------------------------

        orderClient.updateOrderStatus(
                order.getId(),
                "CONFIRMED");

        // -----------------------------------------------------
        // PAYMENT SUCCESS EMAIL
        // -----------------------------------------------------

        NotificationRequest notification =
                NotificationRequest
                        .builder()
                        .to(order.getUserEmail())
                        .customerName(
                                order.getUserEmail())
                        .orderId(order.getId())
                        .notificationType(
                                NotificationType.PAYMENT_SUCCESS)
                        .build();

        notificationClient.sendNotification(
                notification);

        // -----------------------------------------------------
        // RESPONSE
        // -----------------------------------------------------

        return PaymentResponse
                .builder()
                .id(savedPayment.getId())
                .orderId(
                        savedPayment.getOrderId())
                .amount(
                        savedPayment.getAmount())
                .paymentMethod(
                        savedPayment.getPaymentMethod())
                .paymentStatus(
                        savedPayment.getPaymentStatus())
                .paymentDate(
                        savedPayment.getPaymentDate())
                .razorpayOrderId(
                        savedPayment
                                .getRazorpayOrderId())
                .razorpayPaymentId(
                        savedPayment
                                .getRazorpayPaymentId())
                .build();
    }

    // =========================================================
    // GET PAYMENT BY ID
    // =========================================================

    @Override
    public PaymentResponse getPaymentById(
            Long id) {

        Payment payment =
                paymentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new PaymentNotFoundException(
                                        "Payment Not Found"));

        return toResponse(payment);
    }

    // =========================================================
    // GET PAYMENT BY ORDER
    // =========================================================

    @Override
    public PaymentResponse getPaymentByOrderId(
            Long orderId) {

        Payment payment =
                paymentRepository
                        .findByOrderId(orderId)
                        .orElseThrow(() ->
                                new PaymentNotFoundException(
                                        "Payment Not Found"));

        return toResponse(payment);
    }

    // =========================================================
    // REFUND
    // =========================================================

    @Override
    @Transactional
    public PaymentResponse refundPayment(
            Long paymentId) {

        Payment payment =
                paymentRepository
                        .findById(paymentId)
                        .orElseThrow(() ->
                                new PaymentNotFoundException(
                                        "Payment Not Found"));

        if (payment.getPaymentStatus()
                == PaymentStatus.REFUNDED) {

            throw new PaymentAlreadyRefundedException(
                    "Payment is already refunded");
        }

        payment.setPaymentStatus(
                PaymentStatus.REFUNDED);

        Payment updatedPayment =
                paymentRepository.save(payment);

        // -----------------------------------------------------
        // FETCH ORDER
        // -----------------------------------------------------

        OrderResponse order =
                orderClient.getOrderById(
                        payment.getOrderId());

        // -----------------------------------------------------
        // RESTORE INVENTORY
        // -----------------------------------------------------

        inventoryClient.restoreStock(
                StockUpdateRequest
                        .builder()
                        .productId(
                                order.getProductId())
                        .quantity(
                                order.getQuantity())
                        .build());

        // -----------------------------------------------------
        // UPDATE ORDER
        // -----------------------------------------------------

        orderClient.updateOrderStatus(
                payment.getOrderId(),
                "RETURNED");

        // -----------------------------------------------------
        // REFUND EMAIL
        // -----------------------------------------------------

        NotificationRequest notification =
                NotificationRequest
                        .builder()
                        .to(order.getUserEmail())
                        .customerName(
                                order.getUserEmail())
                        .orderId(order.getId())
                        .notificationType(
                                NotificationType.PAYMENT_REFUND)
                        .build();

        notificationClient.sendNotification(
                notification);

        return toResponse(
                updatedPayment);
    }

    // =========================================================
    // COUNT
    // =========================================================

    @Override
    public Long getPaymentCount() {

        return paymentRepository.count();
    }

    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private PaymentResponse toResponse(
            Payment payment) {

        return PaymentResponse
                .builder()
                .id(payment.getId())
                .orderId(
                        payment.getOrderId())
                .amount(
                        payment.getAmount())
                .paymentMethod(
                        payment.getPaymentMethod())
                .paymentStatus(
                        payment.getPaymentStatus())
                .paymentDate(
                        payment.getPaymentDate())
                .razorpayOrderId(
                        payment.getRazorpayOrderId())
                .razorpayPaymentId(
                        payment.getRazorpayPaymentId())
                .build();
    }
}
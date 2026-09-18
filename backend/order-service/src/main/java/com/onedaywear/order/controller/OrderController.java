package com.onedaywear.order.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.onedaywear.order.dto.ApiResponse;
import com.onedaywear.order.dto.OrderRequest;
import com.onedaywear.order.dto.OrderResponse;
import com.onedaywear.order.entity.OrderStatus;
import com.onedaywear.order.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
@Validated
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            Authentication authentication,
            @Valid @RequestBody OrderRequest request) {

        String userEmail = authentication.getName();

        OrderResponse response =
                orderService.placeOrder(userEmail, request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            Authentication authentication) {

        String userEmail = authentication.getName();

        return ResponseEntity.ok(
                orderService.getMyOrders(userEmail));
    }
    
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {

        return ResponseEntity.ok(
                orderService.updateOrderStatus(orderId, status));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                orderService.getOrderById(id));
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getOrderCount() {

        return ResponseEntity.ok(
                orderService.getOrderCount());
    }

    @GetMapping("/revenue")
    public ResponseEntity<BigDecimal> getTotalRevenue() {

        return ResponseEntity.ok(
                orderService.getTotalRevenue());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteOrder(
            @PathVariable Long id) {

        orderService.deleteOrder(id);

        return ResponseEntity.ok(
                new ApiResponse("Order Deleted Successfully"));
    }
    
}
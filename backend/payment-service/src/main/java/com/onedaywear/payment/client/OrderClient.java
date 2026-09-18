package com.onedaywear.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.onedaywear.payment.dto.OrderResponse;

@FeignClient(name = "ORDER-SERVICE")
public interface OrderClient {

    @GetMapping("/orders/{id}")
    OrderResponse getOrderById(@PathVariable Long id);
    
    @PutMapping("/orders/{orderId}/status")
    OrderResponse updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam("status") String status);

}
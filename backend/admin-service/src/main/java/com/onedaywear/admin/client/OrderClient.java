package com.onedaywear.admin.client;

import java.math.BigDecimal;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "ORDER-SERVICE")
public interface OrderClient {

    @GetMapping("/orders/count")
    Long getOrderCount();

    @GetMapping("/orders/revenue")
    BigDecimal getTotalRevenue();

}
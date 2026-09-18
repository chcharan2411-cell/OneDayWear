package com.onedaywear.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "PAYMENT-SERVICE")
public interface PaymentClient {

    @GetMapping("/payments/count")
    Long getPaymentCount();

}
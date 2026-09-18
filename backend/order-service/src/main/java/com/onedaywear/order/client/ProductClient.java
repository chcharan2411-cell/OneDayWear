package com.onedaywear.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;


import com.onedaywear.order.dto.ProductResponse;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductClient {

    @GetMapping("/products/{id}")
    ProductResponse getProductById(@PathVariable Long id);
    
    @PutMapping("/products/{id}/decrease-stock")
    void decreaseStock(@PathVariable Long id,
                       @RequestParam Integer quantity);

    @PutMapping("/products/{id}/increase-stock")
    void increaseStock(@PathVariable Long id,
                       @RequestParam Integer quantity);
}
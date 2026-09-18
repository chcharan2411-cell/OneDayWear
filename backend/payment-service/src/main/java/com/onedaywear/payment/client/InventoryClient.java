package com.onedaywear.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.onedaywear.payment.dto.StockUpdateRequest;

@FeignClient(name = "INVENTORY-SERVICE")
public interface InventoryClient {

    @PostMapping("/inventory/deduct")
    void deductStock(@RequestBody StockUpdateRequest request);

    @PostMapping("/inventory/restore")
    void restoreStock(@RequestBody StockUpdateRequest request);

}
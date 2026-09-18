package com.onedaywear.inventory.service;

import java.util.List;

import com.onedaywear.inventory.dto.InventoryRequest;
import com.onedaywear.inventory.dto.InventoryResponse;
import com.onedaywear.inventory.dto.StockUpdateRequest;

public interface InventoryService {

    InventoryResponse createInventory(
            InventoryRequest request);

    InventoryResponse getInventory(
            Long productId);

    List<InventoryResponse> getAllInventory();

    List<InventoryResponse> getAdminInventory();

    InventoryResponse updateInventory(
            Long productId,
            InventoryRequest request);

    void deductStock(
            StockUpdateRequest request);

    void restoreStock(
            StockUpdateRequest request);

    List<InventoryResponse> getLowStockProducts();

    Long getLowStockCount();

    /*
     * One-time synchronization / initialization.
     */
    int syncInventoryFromProducts();
}
package com.onedaywear.inventory.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.onedaywear.inventory.dto.InventoryRequest;
import com.onedaywear.inventory.dto.InventoryResponse;
import com.onedaywear.inventory.dto.StockUpdateRequest;
import com.onedaywear.inventory.service.InventoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(
            InventoryService inventoryService) {

        this.inventoryService = inventoryService;
    }

    // =====================================================
    // CREATE INVENTORY
    // =====================================================

    @PostMapping
    public ResponseEntity<InventoryResponse> createInventory(
            @Valid @RequestBody InventoryRequest request) {

        return ResponseEntity.ok(
                inventoryService.createInventory(request));
    }

    // =====================================================
    // GET EXISTING INVENTORY
    // =====================================================

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {

        return ResponseEntity.ok(
                inventoryService.getAllInventory());
    }

    // =====================================================
    // ADMIN INVENTORY
    // RETURNS ALL PRODUCTS
    // =====================================================

    @GetMapping("/admin/all")
    public ResponseEntity<List<InventoryResponse>>
    getAdminInventory() {

        return ResponseEntity.ok(
                inventoryService.getAdminInventory());
    }

    // =====================================================
    // ONE-TIME INVENTORY SYNCHRONIZATION
    // =====================================================

    @PostMapping("/admin/sync")
    public ResponseEntity<String> syncInventory() {

        int count =
                inventoryService.syncInventoryFromProducts();

        return ResponseEntity.ok(
                "Inventory synchronized successfully. "
                        + count
                        + " inventory records initialized.");
    }

    // =====================================================
    // GET INVENTORY BY PRODUCT
    // =====================================================

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryResponse>
    getInventory(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                inventoryService.getInventory(productId));
    }

    // =====================================================
    // UPDATE / INITIALIZE INVENTORY
    // =====================================================

    @PutMapping("/{productId}")
    public ResponseEntity<InventoryResponse>
    updateInventory(
            @PathVariable Long productId,
            @Valid @RequestBody InventoryRequest request) {

        return ResponseEntity.ok(
                inventoryService.updateInventory(
                        productId,
                        request));
    }

    // =====================================================
    // DEDUCT STOCK
    // =====================================================

    @PostMapping("/deduct")
    public ResponseEntity<String>
    deductStock(
            @Valid @RequestBody StockUpdateRequest request) {

        inventoryService.deductStock(request);

        return ResponseEntity.ok(
                "Stock Deducted Successfully");
    }

    // =====================================================
    // RESTORE STOCK
    // =====================================================

    @PostMapping("/restore")
    public ResponseEntity<String>
    restoreStock(
            @Valid @RequestBody StockUpdateRequest request) {

        inventoryService.restoreStock(request);

        return ResponseEntity.ok(
                "Stock Restored Successfully");
    }

    // =====================================================
    // LOW STOCK PRODUCTS
    // =====================================================

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>>
    getLowStockProducts() {

        return ResponseEntity.ok(
                inventoryService.getLowStockProducts());
    }

    // =====================================================
    // LOW STOCK COUNT
    // =====================================================

    @GetMapping("/low-stock/count")
    public ResponseEntity<Long>
    getLowStockCount() {

        return ResponseEntity.ok(
                inventoryService.getLowStockCount());
    }
}
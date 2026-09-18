package com.onedaywear.inventory.dto;

import java.time.LocalDateTime;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {

    private Long inventoryId;

    private Long productId;

    private String productName;

    private Integer availableQuantity;

    private Integer lowStockThreshold;

    private Boolean lowStock;

    private LocalDateTime lastUpdated;
}
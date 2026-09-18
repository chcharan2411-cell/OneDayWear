package com.onedaywear.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryRequest {

    @NotNull
    private Long productId;

    @NotNull
    @Min(0)
    private Integer quantity;

}
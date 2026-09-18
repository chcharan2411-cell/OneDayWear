package com.onedaywear.order.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

    @NotNull
    private Long productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull
    @FutureOrPresent(message = "Rental start date cannot be in the past")
    private LocalDate rentalStartDate;

    @NotNull
    private LocalDate rentalEndDate;
}
package com.onedaywear.wishlist.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private BigDecimal rentalPrice;

    private Boolean available;

    private Integer availableQuantity;
}
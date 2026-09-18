package com.onedaywear.cart.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private Long cartId;

    private Long productId;

    private String productName;

    private Integer quantity;

    private BigDecimal rentalPrice;

    private BigDecimal totalPrice;
}
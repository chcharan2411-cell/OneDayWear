package com.onedaywear.wishlist.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistResponse {

    private Long wishlistId;

    private Long productId;

    private String productName;

    private BigDecimal rentalPrice;

    private Boolean available;
}
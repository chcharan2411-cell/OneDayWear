package com.onedaywear.wishlist.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistRequest {

    @NotNull
    private Long productId;

}
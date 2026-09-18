package com.onedaywear.payment.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockUpdateRequest {

    private Long productId;

    private Integer quantity;

}
package com.onedaywear.order.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.onedaywear.order.entity.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;

    private String userEmail;

    private Long productId;

    private Integer quantity;

    private LocalDate rentalStartDate;

    private LocalDate rentalEndDate;

    private BigDecimal totalAmount;

    private BigDecimal securityDeposit;

    private OrderStatus status;

    private LocalDateTime createdAt;

}
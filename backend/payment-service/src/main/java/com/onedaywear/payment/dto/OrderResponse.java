package com.onedaywear.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
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

    private String status;

    private LocalDateTime createdAt;
    
    

}
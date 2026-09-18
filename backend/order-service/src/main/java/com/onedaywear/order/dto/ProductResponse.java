package com.onedaywear.order.dto;

import java.math.BigDecimal;

import com.onedaywear.order.entity.Category;

import lombok.Data;

@Data
public class ProductResponse {

    private Long id;

    private String productName;

    private String brand;

    private Category category;

    private String size;

    private BigDecimal rentalPrice;

    private BigDecimal securityDeposit;

    private Integer availableQuantity;

    private Boolean available;

}
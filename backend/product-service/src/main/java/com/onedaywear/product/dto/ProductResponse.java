package com.onedaywear.product.dto;

import java.math.BigDecimal;

import com.onedaywear.product.entity.Category;
import com.onedaywear.product.entity.ProductSize;
import com.onedaywear.product.entity.ProductType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;

    private String productName;

    private String brand;

    private Category category;

    private ProductType productType;
    
    private ProductSize size;

    private BigDecimal rentalPrice;

    private BigDecimal securityDeposit;

    private Integer availableQuantity;

    private String description;

    private String imageUrl;

    private Boolean available;

}
package com.onedaywear.product.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String brand;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private ProductType productType;
    
    @Enumerated(EnumType.STRING)
    private ProductSize size;

    @Column(nullable = false)
    private BigDecimal rentalPrice;

    @Column(nullable = false)
    private BigDecimal securityDeposit;

    private Integer availableQuantity;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    private Boolean available;

}
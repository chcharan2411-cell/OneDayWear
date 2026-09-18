package com.onedaywear.product.dto;

import java.math.BigDecimal;

import com.onedaywear.product.entity.Category;
import com.onedaywear.product.entity.ProductSize;
import com.onedaywear.product.entity.ProductType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

	@NotBlank(message = "Product Name is required")
	private String productName;

	@NotBlank(message = "Brand is required")
	private String brand;

	@NotNull(message = "Category is required")
	private Category category;

	 @NotNull(message = "Product Type is required")
	    private ProductType productType;
	 
	@NotNull(message = "Size is required")
	private ProductSize size;

	@NotNull(message = "Rental Price is required")
	private BigDecimal rentalPrice;

	@NotNull(message = "Security Deposit is required")
	private BigDecimal securityDeposit;

	@NotNull(message = "Available Quantity is required")
	private Integer availableQuantity;

    private String description;

    private String imageUrl;
}
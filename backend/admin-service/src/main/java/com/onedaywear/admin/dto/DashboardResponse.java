package com.onedaywear.admin.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Long totalUsers;

    private Long totalProducts;

    private Long totalOrders;

    private Long totalPayments;

    private BigDecimal totalRevenue;

    private Long totalReviews;

    private Long totalWishlistItems;

    private Long lowStockProducts;

}
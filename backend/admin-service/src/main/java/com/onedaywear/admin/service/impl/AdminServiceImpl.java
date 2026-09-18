package com.onedaywear.admin.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.onedaywear.admin.client.AuthClient;
import com.onedaywear.admin.client.InventoryClient;
import com.onedaywear.admin.client.OrderClient;
import com.onedaywear.admin.client.PaymentClient;
import com.onedaywear.admin.client.ProductClient;
import com.onedaywear.admin.client.ReviewClient;
import com.onedaywear.admin.client.WishlistClient;
import com.onedaywear.admin.dto.DashboardResponse;
import com.onedaywear.admin.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {

    private final ProductClient productClient;
    private final OrderClient orderClient;
    private final PaymentClient paymentClient;
    private final ReviewClient reviewClient;
    private final WishlistClient wishlistClient;
    private final InventoryClient inventoryClient;
    private final AuthClient authClient;

    public AdminServiceImpl(
            ProductClient productClient,
            OrderClient orderClient,
            PaymentClient paymentClient,
            ReviewClient reviewClient,
            WishlistClient wishlistClient,
            InventoryClient inventoryClient,
            AuthClient authClient) {

        this.productClient = productClient;
        this.orderClient = orderClient;
        this.paymentClient = paymentClient;
        this.reviewClient = reviewClient;
        this.wishlistClient = wishlistClient;
        this.inventoryClient = inventoryClient;
        this.authClient = authClient;
    }

    @Override
    public DashboardResponse getDashboard() {

        Long totalUsers = authClient.getUserCount();

        Long totalProducts = productClient.getProductCount();

        Long totalOrders = orderClient.getOrderCount();

        Long totalPayments = paymentClient.getPaymentCount();

        BigDecimal totalRevenue = orderClient.getTotalRevenue();

        Long totalReviews = reviewClient.getReviewCount();

        Long totalWishlistItems = wishlistClient.getWishlistCount();

        Long lowStockProducts = inventoryClient.getLowStockCount();

        return DashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalPayments(totalPayments)
                .totalRevenue(totalRevenue)
                .totalReviews(totalReviews)
                .totalWishlistItems(totalWishlistItems)
                .lowStockProducts(lowStockProducts)
                .build();
    }

    @Override
    public List<Map<String, Object>> getAllUsers() {

        return authClient.getAllUsers();
    }
}
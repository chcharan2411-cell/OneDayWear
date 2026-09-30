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

        String authHeader = null;
        org.springframework.web.context.request.RequestAttributes attributes =
                org.springframework.web.context.request.RequestContextHolder.getRequestAttributes();
        if (attributes instanceof org.springframework.web.context.request.ServletRequestAttributes sAttrs) {
            try {
                authHeader = sAttrs.getRequest().getHeader("Authorization");
            } catch (Exception ignored) {
            }
        }
        final String tokenToUse = authHeader;

        java.util.concurrent.CompletableFuture<Long> usersFuture =
                runAsyncWithToken(tokenToUse, () -> safeGet(authClient::getUserCount, 0L));

        java.util.concurrent.CompletableFuture<Long> productsFuture =
                runAsyncWithToken(tokenToUse, () -> safeGet(productClient::getProductCount, 0L));

        java.util.concurrent.CompletableFuture<Long> ordersFuture =
                runAsyncWithToken(tokenToUse, () -> safeGet(orderClient::getOrderCount, 0L));

        java.util.concurrent.CompletableFuture<Long> paymentsFuture =
                runAsyncWithToken(tokenToUse, () -> safeGet(paymentClient::getPaymentCount, 0L));

        java.util.concurrent.CompletableFuture<BigDecimal> revenueFuture =
                runAsyncWithToken(tokenToUse, () -> safeGet(orderClient::getTotalRevenue, BigDecimal.ZERO));

        java.util.concurrent.CompletableFuture<Long> reviewsFuture =
                runAsyncWithToken(tokenToUse, () -> safeGet(reviewClient::getReviewCount, 0L));

        java.util.concurrent.CompletableFuture<Long> wishlistFuture =
                runAsyncWithToken(tokenToUse, () -> safeGet(wishlistClient::getWishlistCount, 0L));

        java.util.concurrent.CompletableFuture<Long> lowStockFuture =
                runAsyncWithToken(tokenToUse, () -> safeGet(inventoryClient::getLowStockCount, 0L));

        try {
            java.util.concurrent.CompletableFuture.allOf(
                    usersFuture, productsFuture, ordersFuture, paymentsFuture,
                    revenueFuture, reviewsFuture, wishlistFuture, lowStockFuture
            ).get(3500, java.util.concurrent.TimeUnit.MILLISECONDS);
        } catch (Exception ignored) {
        }

        Long totalUsers = getOrDefault(usersFuture, 0L);
        Long totalProducts = getOrDefault(productsFuture, 0L);
        Long totalOrders = getOrDefault(ordersFuture, 0L);
        Long totalPayments = getOrDefault(paymentsFuture, 0L);
        BigDecimal totalRevenue = getOrDefault(revenueFuture, BigDecimal.ZERO);
        Long totalReviews = getOrDefault(reviewsFuture, 0L);
        Long totalWishlistItems = getOrDefault(wishlistFuture, 0L);
        Long lowStockProducts = getOrDefault(lowStockFuture, 0L);

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

    private final java.util.concurrent.ExecutorService metricExecutor =
            java.util.concurrent.Executors.newFixedThreadPool(8);

    private <T> java.util.concurrent.CompletableFuture<T> runAsyncWithToken(
            String token,
            java.util.function.Supplier<T> supplier) {

        return java.util.concurrent.CompletableFuture.supplyAsync(() -> {
            if (token != null) {
                com.onedaywear.admin.config.FeignAuthConfig.setAuthToken(token);
            }
            try {
                return supplier.get();
            } finally {
                com.onedaywear.admin.config.FeignAuthConfig.clearAuthToken();
            }
        }, metricExecutor);
    }

    private <T> T getOrDefault(java.util.concurrent.CompletableFuture<T> future, T defaultValue) {
        try {
            if (future.isDone() && !future.isCompletedExceptionally()) {
                T value = future.getNow(defaultValue);
                return value != null ? value : defaultValue;
            }
            return defaultValue;
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private <T> T safeGet(java.util.function.Supplier<T> supplier, T defaultValue) {
        try {
            T value = supplier.get();
            return value != null ? value : defaultValue;
        } catch (Exception e) {
            System.err.println("Dashboard metric warning: " + e.getMessage());
            return defaultValue;
        }
    }

    @Override
    public List<Map<String, Object>> getAllUsers() {

        return authClient.getAllUsers();
    }
}
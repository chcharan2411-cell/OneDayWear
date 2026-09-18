package com.onedaywear.order.service;

import java.math.BigDecimal;
import java.util.List;

import com.onedaywear.order.dto.OrderRequest;
import com.onedaywear.order.dto.OrderResponse;
import com.onedaywear.order.entity.OrderStatus;

public interface OrderService {

    OrderResponse placeOrder(String userEmail, OrderRequest request);

    List<OrderResponse> getMyOrders(String userEmail);

    List<OrderResponse> getAllOrders();

    OrderResponse getOrderById(Long id);

    OrderResponse updateOrderStatus(Long id, OrderStatus status);

    void deleteOrder(Long id);
    
    Long getOrderCount();

    BigDecimal getTotalRevenue();

}
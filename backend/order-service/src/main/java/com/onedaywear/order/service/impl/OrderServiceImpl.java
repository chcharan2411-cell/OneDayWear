package com.onedaywear.order.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.onedaywear.order.client.NotificationClient;
import com.onedaywear.order.client.ProductClient;
import com.onedaywear.order.dto.NotificationRequest;
import com.onedaywear.order.dto.OrderRequest;
import com.onedaywear.order.dto.OrderResponse;
import com.onedaywear.order.dto.ProductResponse;
import com.onedaywear.order.entity.NotificationType;
import com.onedaywear.order.entity.Order;
import com.onedaywear.order.entity.OrderStatus;
import com.onedaywear.order.exception.InsufficientStockException;
import com.onedaywear.order.exception.InvalidRentalDateException;
import com.onedaywear.order.exception.OrderNotFoundException;
import com.onedaywear.order.exception.ProductNotAvailableException;
import com.onedaywear.order.exception.ProductNotFoundException;
import com.onedaywear.order.repository.OrderRepository;
import com.onedaywear.order.service.OrderService;
	
@Service
public class OrderServiceImpl implements OrderService {

	private final OrderRepository orderRepository;
	private final ProductClient productClient;

	private final NotificationClient notificationClient;
	public OrderServiceImpl(OrderRepository orderRepository,
	                        ProductClient productClient, NotificationClient notificationClient) {
	    this.orderRepository = orderRepository;
	    this.productClient = productClient;
	    this.notificationClient = notificationClient;
	}

	@Override
	public OrderResponse placeOrder(String userEmail, OrderRequest request) {

		System.out.println("===== INSIDE PLACE ORDER =====");
		
	    ProductResponse product =
	            productClient.getProductById(request.getProductId());

	    LocalDate today = LocalDate.now();

	    // Validate rental dates
	    if (request.getRentalStartDate().isBefore(today)) {
	    	throw new InvalidRentalDateException(
	    	        "Rental Start Date cannot be in the past");
	    }

	    if (!request.getRentalEndDate().isAfter(request.getRentalStartDate())) {
	    	throw new InvalidRentalDateException(
	    	        "Rental End Date must be after Rental Start Date");
	    }

	    // Validate product
	    if (product == null) {
	    	throw new ProductNotFoundException("Product Not Found");
	    }

	    if (!Boolean.TRUE.equals(product.getAvailable())) {
	    	throw new ProductNotAvailableException("Product Not Available");
	    }

	    if (product.getAvailableQuantity() < request.getQuantity()) {
	    	throw new InsufficientStockException("Insufficient Quantity");
	    }

	    // Calculate rental days
	    long rentalDays = ChronoUnit.DAYS.between(
	            request.getRentalStartDate(),
	            request.getRentalEndDate());

	    // Calculate rental amount
	    BigDecimal totalAmount = product.getRentalPrice()
	            .multiply(BigDecimal.valueOf(request.getQuantity()))
	            .multiply(BigDecimal.valueOf(rentalDays));

	    // Calculate security deposit
	    BigDecimal securityDeposit = product.getSecurityDeposit()
	            .multiply(BigDecimal.valueOf(request.getQuantity()));

	    // Create Order with PENDING status (Stock will ONLY be deducted once payment is 100% completed)
	    Order order = Order.builder()
	            .userEmail(userEmail)
	            .productId(request.getProductId())
	            .quantity(request.getQuantity())
	            .rentalStartDate(request.getRentalStartDate())
	            .rentalEndDate(request.getRentalEndDate())
	            .totalAmount(totalAmount)
	            .securityDeposit(securityDeposit)
	            .status(OrderStatus.PENDING)
	            .build();

	    // Save Order
	    Order savedOrder = orderRepository.save(order);

	    return mapToResponse(savedOrder);
	}

    @Override
    public List<OrderResponse> getMyOrders(String userEmail) {

        return orderRepository.findByUserEmail(userEmail)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public OrderResponse getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new OrderNotFoundException("Order Not Found"));

        return mapToResponse(order);
    }

    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {

        Order order = orderRepository.findById(orderId)
        		.orElseThrow(() -> new OrderNotFoundException("Order Not Found"));

        OrderStatus oldStatus = order.getStatus();

        // Deduct stock and send confirmation ONLY when payment is 100% completed and order is CONFIRMED
        if (status == OrderStatus.CONFIRMED && oldStatus != OrderStatus.CONFIRMED) {
            try {
                productClient.decreaseStock(
                        order.getProductId(),
                        order.getQuantity());
            } catch (Exception e) {
                System.err.println("Error deducting stock on payment confirmation: " + e.getMessage());
            }

            try {
                NotificationRequest notification =
                        NotificationRequest.builder()
                                .to(order.getUserEmail())
                                .customerName(order.getUserEmail())
                                .orderId(order.getId())
                                .notificationType(NotificationType.ORDER_CONFIRMATION)
                                .build();

                java.util.concurrent.CompletableFuture.runAsync(() -> {
                    try {
                        notificationClient.sendNotification(notification);
                    } catch (Exception e) {
                        System.err.println("Error sending order confirmation notification: " + e.getMessage());
                    }
                });
            } catch (Exception e) {
                System.err.println("Error creating order confirmation notification: " + e.getMessage());
            }
        }

        // Restore stock only once if order was confirmed and is now cancelled or returned
        if ((status == OrderStatus.CANCELLED || status == OrderStatus.RETURNED)
                && oldStatus == OrderStatus.CONFIRMED) {

            try {
                productClient.increaseStock(
                        order.getProductId(),
                        order.getQuantity());
            } catch (Exception e) {
                System.err.println("Error restoring stock on order cancellation: " + e.getMessage());
            }
        }

        order.setStatus(status);

        Order updatedOrder = orderRepository.save(order);

        return mapToResponse(updatedOrder);
    }
    
    @Override
    public void deleteOrder(Long id) {

        Order order = orderRepository.findById(id)
        		.orElseThrow(() -> new OrderNotFoundException("Order Not Found"));

        orderRepository.delete(order);
    }

    private OrderResponse mapToResponse(Order order) {

        return OrderResponse.builder()
                .id(order.getId())
                .userEmail(order.getUserEmail())
                .productId(order.getProductId())
                .quantity(order.getQuantity())
                .rentalStartDate(order.getRentalStartDate())
                .rentalEndDate(order.getRentalEndDate())
                .totalAmount(order.getTotalAmount())
                .securityDeposit(order.getSecurityDeposit())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
    
    @Override
    public Long getOrderCount() {
        return orderRepository.count();
    }

    @Override
    public BigDecimal getTotalRevenue() {

        return orderRepository.findAll()
                .stream()
                .map(order -> order.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
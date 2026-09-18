package com.onedaywear.cart.service;

import java.util.List;

import com.onedaywear.cart.dto.CartRequest;
import com.onedaywear.cart.dto.CartResponse;

public interface CartService {

    CartResponse addToCart(String userEmail, CartRequest request);

    List<CartResponse> getMyCart(String userEmail);

    CartResponse updateQuantity(Long cartId, Integer quantity);

    void removeItem(Long cartId);

    void clearCart(String userEmail);
}
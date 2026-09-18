package com.onedaywear.cart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.onedaywear.cart.dto.CartRequest;
import com.onedaywear.cart.dto.CartResponse;
import com.onedaywear.cart.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @RequestParam String userEmail,
            @Valid @RequestBody CartRequest request) {

        return ResponseEntity.ok(
                cartService.addToCart(userEmail, request));
    }

    @GetMapping
    public ResponseEntity<List<CartResponse>> getMyCart(
            @RequestParam String userEmail) {

        return ResponseEntity.ok(
                cartService.getMyCart(userEmail));
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable Long cartId,
            @RequestParam Integer quantity) {

        return ResponseEntity.ok(
                cartService.updateQuantity(cartId, quantity));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<String> removeItem(
            @PathVariable Long cartId) {

        cartService.removeItem(cartId);

        return ResponseEntity.ok("Cart Item Removed Successfully");
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(
            @RequestParam String userEmail) {

        cartService.clearCart(userEmail);

        return ResponseEntity.ok("Cart Cleared Successfully");
    }
}
package com.onedaywear.wishlist.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.onedaywear.wishlist.dto.WishlistRequest;
import com.onedaywear.wishlist.dto.WishlistResponse;
import com.onedaywear.wishlist.service.WishlistService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping
    public ResponseEntity<WishlistResponse> addToWishlist(
            @RequestParam String userEmail,
            @Valid @RequestBody WishlistRequest request) {

        return ResponseEntity.ok(
                wishlistService.addToWishlist(userEmail, request));
    }

    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getWishlist(
            @RequestParam String userEmail) {

        return ResponseEntity.ok(
                wishlistService.getWishlist(userEmail));
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable Long wishlistId) {

        wishlistService.removeFromWishlist(wishlistId);

        return ResponseEntity.ok("Wishlist Item Removed Successfully");
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearWishlist(
            @RequestParam String userEmail) {

        wishlistService.clearWishlist(userEmail);

        return ResponseEntity.ok("Wishlist Cleared Successfully");
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getWishlistCount() {

        return ResponseEntity.ok(
                wishlistService.getWishlistCount());
    }
    
}
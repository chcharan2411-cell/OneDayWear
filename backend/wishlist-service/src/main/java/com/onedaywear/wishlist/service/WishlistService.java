package com.onedaywear.wishlist.service;

import java.util.List;

import com.onedaywear.wishlist.dto.WishlistRequest;
import com.onedaywear.wishlist.dto.WishlistResponse;

public interface WishlistService {

    WishlistResponse addToWishlist(String userEmail,
                                   WishlistRequest request);

    List<WishlistResponse> getWishlist(String userEmail);

    void removeFromWishlist(Long wishlistId);

    void clearWishlist(String userEmail);

    Long getWishlistCount();
    
}
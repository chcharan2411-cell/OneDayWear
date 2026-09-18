package com.onedaywear.wishlist.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.onedaywear.wishlist.client.ProductClient;
import com.onedaywear.wishlist.dto.ProductResponse;
import com.onedaywear.wishlist.dto.WishlistRequest;
import com.onedaywear.wishlist.dto.WishlistResponse;
import com.onedaywear.wishlist.entity.Wishlist;
import com.onedaywear.wishlist.exception.ProductNotFoundException;
import com.onedaywear.wishlist.exception.WishlistItemNotFoundException;
import com.onedaywear.wishlist.repository.WishlistRepository;
import com.onedaywear.wishlist.service.WishlistService;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductClient productClient;

    public WishlistServiceImpl(WishlistRepository wishlistRepository,
                               ProductClient productClient) {

        this.wishlistRepository = wishlistRepository;
        this.productClient = productClient;
    }

    @Override
    public WishlistResponse addToWishlist(String userEmail,
                                          WishlistRequest request) {

        // Fetch Product from Product Service
        ProductResponse product =
                productClient.getProductById(request.getProductId());

        if (product == null) {
            throw new ProductNotFoundException("Product Not Found");
        }

        // Check if already exists in wishlist
        Wishlist wishlist = wishlistRepository
                .findByUserEmailAndProductId(userEmail, request.getProductId())
                .orElse(null);

        if (wishlist == null) {

            wishlist = Wishlist.builder()
                    .userEmail(userEmail)
                    .productId(request.getProductId())
                    .build();

            wishlist = wishlistRepository.save(wishlist);
        }

        return WishlistResponse.builder()
                .wishlistId(wishlist.getId())
                .productId(product.getId())
                .productName(product.getName())
                .rentalPrice(product.getRentalPrice())
                .available(product.getAvailable())
                .build();
    }

    @Override
    public List<WishlistResponse> getWishlist(String userEmail) {

        return wishlistRepository.findByUserEmail(userEmail)
                .stream()
                .map(wishlist -> {

                    ProductResponse product =
                            productClient.getProductById(wishlist.getProductId());

                    return WishlistResponse.builder()
                            .wishlistId(wishlist.getId())
                            .productId(product.getId())
                            .productName(product.getName())
                            .rentalPrice(product.getRentalPrice())
                            .available(product.getAvailable())
                            .build();

                })
                .toList();
    }
    
    @Override
    public void removeFromWishlist(Long wishlistId) {

        Wishlist wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() ->
                        new WishlistItemNotFoundException("Wishlist Item Not Found"));

        wishlistRepository.delete(wishlist);
    }

    @Override
    public void clearWishlist(String userEmail) {

        var wishlistItems = wishlistRepository.findByUserEmail(userEmail);

        wishlistRepository.deleteAll(wishlistItems);
    }
    
    @Override
    public Long getWishlistCount() {
        return wishlistRepository.count();
    }
    
}
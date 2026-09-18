package com.onedaywear.wishlist.exception;

public class WishlistItemNotFoundException extends RuntimeException {

    public WishlistItemNotFoundException(String message) {
        super(message);
    }
}
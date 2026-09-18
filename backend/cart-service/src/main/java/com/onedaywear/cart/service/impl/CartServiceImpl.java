package com.onedaywear.cart.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.onedaywear.cart.client.ProductClient;
import com.onedaywear.cart.dto.CartRequest;
import com.onedaywear.cart.dto.CartResponse;
import com.onedaywear.cart.dto.ProductResponse;
import com.onedaywear.cart.entity.Cart;
import com.onedaywear.cart.exception.CartItemNotFoundException;
import com.onedaywear.cart.exception.InsufficientStockException;
import com.onedaywear.cart.exception.ProductNotFoundException;
import com.onedaywear.cart.repository.CartRepository;
import com.onedaywear.cart.service.CartService;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductClient productClient;

    public CartServiceImpl(CartRepository cartRepository,
                           ProductClient productClient) {

        this.cartRepository = cartRepository;
        this.productClient = productClient;
    }
    
    @Override
    public CartResponse addToCart(String userEmail,
                                  CartRequest request) {

        // Fetch Product from Product Service
        ProductResponse product =
                productClient.getProductById(request.getProductId());

        if (product == null) {
            throw new ProductNotFoundException("Product Not Found");
        }

        if (!Boolean.TRUE.equals(product.getAvailable())) {
            throw new ProductNotFoundException("Product Not Available");
        }

        if (request.getQuantity() > product.getAvailableQuantity()) {
            throw new InsufficientStockException("Insufficient Stock");
        }

        // Check if product already exists in cart
        Cart cart = cartRepository
                .findByUserEmailAndProductId(userEmail, request.getProductId())
                .orElse(null);

        if (cart != null) {

            int newQuantity = cart.getQuantity() + request.getQuantity();

            if (newQuantity > product.getAvailableQuantity()) {
                throw new InsufficientStockException("Insufficient Stock");
            }

            cart.setQuantity(newQuantity);

        } else {

            cart = Cart.builder()
                    .userEmail(userEmail)
                    .productId(request.getProductId())
                    .quantity(request.getQuantity())
                    .build();
        }

        Cart savedCart = cartRepository.save(cart);

        return CartResponse.builder()
                .cartId(savedCart.getId())
                .productId(product.getId())
                .productName(product.getName())
                .quantity(savedCart.getQuantity())
                .rentalPrice(product.getRentalPrice())
                .totalPrice(product.getRentalPrice()
                        .multiply(BigDecimal.valueOf(savedCart.getQuantity())))
                .build();
    }
    
    @Override
    public List<CartResponse> getMyCart(String userEmail) {

        return cartRepository.findByUserEmail(userEmail)
                .stream()
                .map(cart -> {

                    ProductResponse product =
                            productClient.getProductById(cart.getProductId());

                    return CartResponse.builder()
                            .cartId(cart.getId())
                            .productId(product.getId())
                            .productName(product.getName())
                            .quantity(cart.getQuantity())
                            .rentalPrice(product.getRentalPrice())
                            .totalPrice(
                                    product.getRentalPrice()
                                            .multiply(BigDecimal.valueOf(cart.getQuantity()))
                            )
                            .build();

                })
                .toList();
    }

    @Override
    public CartResponse updateQuantity(Long cartId,
                                       Integer quantity) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new CartItemNotFoundException("Cart Item Not Found"));

        ProductResponse product =
                productClient.getProductById(cart.getProductId());

        if (quantity > product.getAvailableQuantity()) {
            throw new InsufficientStockException("Insufficient Stock");
        }

        cart.setQuantity(quantity);

        Cart updatedCart = cartRepository.save(cart);

        return CartResponse.builder()
                .cartId(updatedCart.getId())
                .productId(product.getId())
                .productName(product.getName())
                .quantity(updatedCart.getQuantity())
                .rentalPrice(product.getRentalPrice())
                .totalPrice(
                        product.getRentalPrice()
                                .multiply(BigDecimal.valueOf(updatedCart.getQuantity()))
                )
                .build();
    }

    @Override
    public void removeItem(Long cartId) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new CartItemNotFoundException("Cart Item Not Found"));

        cartRepository.delete(cart);
    }

    @Override
    public void clearCart(String userEmail) {

    	List<Cart> carts = cartRepository.findByUserEmail(userEmail);

        cartRepository.deleteAll(carts);
    }

}
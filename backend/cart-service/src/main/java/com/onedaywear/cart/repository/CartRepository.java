package com.onedaywear.cart.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onedaywear.cart.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUserEmail(String userEmail);

    Optional<Cart> findByUserEmailAndProductId(String userEmail,
                                               Long productId);

    void deleteByUserEmail(String userEmail);
}
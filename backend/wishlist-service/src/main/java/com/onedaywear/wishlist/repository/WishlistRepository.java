package com.onedaywear.wishlist.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onedaywear.wishlist.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUserEmail(String userEmail);

    Optional<Wishlist> findByUserEmailAndProductId(String userEmail,
                                                   Long productId);

    void deleteByUserEmail(String userEmail);
}
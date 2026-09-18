package com.onedaywear.review.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onedaywear.review.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductId(Long productId);

    List<Review> findByUserEmail(String userEmail);

    Optional<Review> findByUserEmailAndProductId(
            String userEmail,
            Long productId
    );

    boolean existsByUserEmailAndProductId(
            String userEmail,
            Long productId
    );
}
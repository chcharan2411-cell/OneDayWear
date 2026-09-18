package com.onedaywear.review.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onedaywear.review.client.ProductClient;
import com.onedaywear.review.dto.ProductResponse;
import com.onedaywear.review.dto.ReviewRequest;
import com.onedaywear.review.dto.ReviewResponse;
import com.onedaywear.review.entity.Review;
import com.onedaywear.review.exception.ProductNotFoundException;
import com.onedaywear.review.exception.ReviewNotFoundException;
import com.onedaywear.review.repository.ReviewRepository;
import com.onedaywear.review.service.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductClient productClient;

    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            ProductClient productClient) {

        this.reviewRepository = reviewRepository;
        this.productClient = productClient;
    }

    @Override
    @Transactional
    public ReviewResponse addReview(
            String userEmail,
            ReviewRequest request) {

        // -----------------------------------------
        // 1. Validate product
        // -----------------------------------------

        ProductResponse product =
                productClient.getProductById(
                        request.getProductId());

        if (product == null) {
            throw new ProductNotFoundException(
                    "Product Not Found");
        }

        // -----------------------------------------
        // 2. Prevent duplicate review
        // -----------------------------------------

        boolean alreadyReviewed =
                reviewRepository
                        .existsByUserEmailAndProductId(
                                userEmail,
                                request.getProductId());

        if (alreadyReviewed) {

            throw new IllegalStateException(
                    "You have already reviewed this product");
        }

        // -----------------------------------------
        // 3. Create review
        // -----------------------------------------

        Review review = Review.builder()
                .userEmail(userEmail)
                .productId(request.getProductId())
                .rating(request.getRating())
                .review(request.getReview())
                .build();

        Review savedReview =
                reviewRepository.save(review);

        // -----------------------------------------
        // 4. Return response
        // -----------------------------------------

        return mapToResponse(
                savedReview,
                product);
    }

    @Override
    public List<ReviewResponse> getReviewsByProduct(
            Long productId) {

        ProductResponse product =
                productClient.getProductById(productId);

        if (product == null) {
            throw new ProductNotFoundException(
                    "Product Not Found");
        }

        return reviewRepository
                .findByProductId(productId)
                .stream()
                .map(review ->
                        mapToResponse(
                                review,
                                product))
                .toList();
    }

    @Override
    public Double getAverageRating(
            Long productId) {

        List<Review> reviews =
                reviewRepository
                        .findByProductId(productId);

        if (reviews.isEmpty()) {
            return 0.0;
        }

        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {

        Review review =
                reviewRepository
                        .findById(reviewId)
                        .orElseThrow(() ->
                                new ReviewNotFoundException(
                                        "Review Not Found"));

        reviewRepository.delete(review);
    }
    
    @Override
    public List<ReviewResponse> getAllReviews() {

        return reviewRepository.findAll()
                .stream()
                .map(review -> {

                    ProductResponse product = null;

                    try {
                        product = productClient.getProductById(
                                review.getProductId()
                        );
                    } catch (Exception e) {
                        System.out.println(
                                "Unable to fetch product "
                                + review.getProductId()
                        );
                    }

                    return mapToResponse(review, product);
                })
                .toList();
    }

    @Override
    public Long getReviewCount() {

        return reviewRepository.count();
    }

    // -----------------------------------------
    // RESPONSE MAPPER
    // -----------------------------------------

    private ReviewResponse mapToResponse(
            Review review,
            ProductResponse product) {

        return ReviewResponse.builder()
                .reviewId(review.getId())
                .userEmail(review.getUserEmail())
                .productId(review.getProductId())
                .productName(
                        product != null
                                ? product.getName()
                                : "Product #" +
                                  review.getProductId())
                .rating(review.getRating())
                .review(review.getReview())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
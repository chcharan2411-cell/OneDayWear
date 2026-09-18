package com.onedaywear.review.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.onedaywear.review.dto.ReviewRequest;
import com.onedaywear.review.dto.ReviewResponse;
import com.onedaywear.review.service.ReviewService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(
            ReviewService reviewService) {

        this.reviewService = reviewService;
    }

    // ===============================
    // ADD REVIEW
    // LOGGED-IN USER
    // ===============================

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            Authentication authentication,
            @Valid @RequestBody ReviewRequest request) {

        String userEmail =
                authentication.getName();

        return ResponseEntity.ok(
                reviewService.addReview(
                        userEmail,
                        request));
    }

    // ===============================
    // GET REVIEWS BY PRODUCT
    // PUBLIC
    // ===============================

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>>
    getReviewsByProduct(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                reviewService.getReviewsByProduct(
                        productId));
    }

    // ===============================
    // AVERAGE RATING
    // PUBLIC
    // ===============================

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Double> getAverageRating(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                reviewService.getAverageRating(
                        productId));
    }

    // ===============================
    // DELETE REVIEW
    // AUTHENTICATED
    // ===============================

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId) {

        reviewService.deleteReview(reviewId);

        return ResponseEntity.ok(
                "Review Deleted Successfully");
    }

    // ===============================
    // REVIEW COUNT
    // PUBLIC
    // ===============================

    @GetMapping("/count")
    public ResponseEntity<Long> getReviewCount() {

        return ResponseEntity.ok(
                reviewService.getReviewCount());
    }
}
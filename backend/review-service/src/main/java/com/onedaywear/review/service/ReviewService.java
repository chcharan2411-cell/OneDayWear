package com.onedaywear.review.service;

import java.util.List;

import com.onedaywear.review.dto.ReviewRequest;
import com.onedaywear.review.dto.ReviewResponse;

public interface ReviewService {

    ReviewResponse addReview(
            String userEmail,
            ReviewRequest request
    );

    List<ReviewResponse> getAllReviews();
    
    List<ReviewResponse> getReviewsByProduct(
            Long productId
    );
    

    Double getAverageRating(
            Long productId
    );

    void deleteReview(
            Long reviewId
    );

    Long getReviewCount();
}
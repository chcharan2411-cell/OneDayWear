package com.onedaywear.review.dto;

import java.time.LocalDateTime;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long reviewId;

    private String userEmail;

    private Long productId;

    private String productName;

    private Integer rating;

    private String review;

    private LocalDateTime createdAt;
}
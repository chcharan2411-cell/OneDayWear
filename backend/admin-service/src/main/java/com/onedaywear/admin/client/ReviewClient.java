package com.onedaywear.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "REVIEW-SERVICE")
public interface ReviewClient {

    @GetMapping("/reviews/count")
    Long getReviewCount();

}
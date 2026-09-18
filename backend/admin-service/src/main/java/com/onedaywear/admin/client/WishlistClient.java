package com.onedaywear.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "WISHLIST-SERVICE")
public interface WishlistClient {

    @GetMapping("/wishlist/count")
    Long getWishlistCount();

}
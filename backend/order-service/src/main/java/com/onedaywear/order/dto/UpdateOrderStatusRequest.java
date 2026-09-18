package com.onedaywear.order.dto;

import com.onedaywear.order.entity.OrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {

    @NotNull
    private OrderStatus status;

}
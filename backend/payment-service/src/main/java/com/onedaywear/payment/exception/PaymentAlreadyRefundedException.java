package com.onedaywear.payment.exception;

public class PaymentAlreadyRefundedException extends RuntimeException {

    public PaymentAlreadyRefundedException(String message) {
        super(message);
    }
}
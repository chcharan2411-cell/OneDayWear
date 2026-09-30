package com.onedaywear.auth.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidation(
	        MethodArgumentNotValidException ex) {

	    Map<String, String> errors = new HashMap<>();

	    ex.getBindingResult().getFieldErrors().forEach(error -> {
	        errors.put(error.getField(), error.getDefaultMessage());
	    });
	    return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(UserAlreadyExistsException.class)
	public ResponseEntity<Map<String, String>> handleUserAlreadyExists(
	        UserAlreadyExistsException ex) {

	    Map<String, String> error = new HashMap<>();
	    error.put("error", ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Map<String, String>> handleRuntimeException(
	        RuntimeException ex) {

	    Map<String, String> error = new HashMap<>();
	    error.put("error", ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

}
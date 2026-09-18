package com.onedaywear.product.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.onedaywear.product.dto.ApiResponse;
import com.onedaywear.product.dto.ProductRequest;
import com.onedaywear.product.dto.ProductResponse;
import com.onedaywear.product.entity.Category;
import com.onedaywear.product.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/products")
@Validated
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> addProduct(
            @Valid @RequestBody ProductRequest request) {

        ProductResponse response = productService.addProduct(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {

        return ResponseEntity.ok(productService.getAllProducts());

    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {

        return ResponseEntity.ok(productService.getProductById(id));

    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        return ResponseEntity.ok(productService.updateProduct(id, request));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam String name) {

        return ResponseEntity.ok(productService.searchProducts(name));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(
            @PathVariable Category category) {

        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id) {

        return ResponseEntity.ok(productService.deleteProduct(id));

    }
    
    @PutMapping("/{id}/decrease-stock")
    public ResponseEntity<ApiResponse> decreaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {

        productService.decreaseStock(id, quantity);

        return ResponseEntity.ok(
                new ApiResponse("Stock Updated Successfully"));
    }
    
    @PutMapping("/{id}/increase-stock")
    public ResponseEntity<ApiResponse> increaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {

        System.out.println(">>> INSIDE increaseStock Controller <<<");

        productService.increaseStock(id, quantity);

        return ResponseEntity.ok(
                new ApiResponse("Stock Restored Successfully"));
    }
    
    @PutMapping("/{id}/test")
    public ResponseEntity<String> test(@PathVariable Long id) {
        return ResponseEntity.ok("TEST OK");
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getProductCount() {

        return ResponseEntity.ok(
                productService.getProductCount());
    }
    
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<String> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        String imageName =
                productService.uploadProductImage(id, file);

        return ResponseEntity.ok(imageName);
    }
}
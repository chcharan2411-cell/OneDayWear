package com.onedaywear.product.service;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.onedaywear.product.dto.ApiResponse;
import com.onedaywear.product.dto.ProductRequest;
import com.onedaywear.product.dto.ProductResponse;
import com.onedaywear.product.entity.Category;

public interface ProductService {

    ProductResponse addProduct(ProductRequest request);

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(Long id);

    ApiResponse deleteProduct(Long id);

    ProductResponse updateProduct(Long id, ProductRequest request);
    
    List<ProductResponse> searchProducts(String name);
    
    List<ProductResponse> getProductsByCategory(Category category);
    
    void decreaseStock(Long productId, Integer quantity);

    void increaseStock(Long productId, Integer quantity);
    
    Long getProductCount();
    
    String uploadProductImage(Long productId, MultipartFile file);
}
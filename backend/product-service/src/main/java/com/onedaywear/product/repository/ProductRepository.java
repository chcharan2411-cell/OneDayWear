package com.onedaywear.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.onedaywear.product.entity.Category;
import com.onedaywear.product.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(Category category);

    List<Product> findByProductNameContainingIgnoreCase(String productName);

}
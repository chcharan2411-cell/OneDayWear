	package com.onedaywear.product.service.impl;
	
	import java.util.List;
	import org.springframework.web.multipart.MultipartFile;
	import org.springframework.stereotype.Service;
	import java.util.stream.Collectors;
	import com.onedaywear.product.exception.ProductNotFoundException;
	import com.onedaywear.product.entity.Category;
	import com.onedaywear.product.entity.Product;
	import com.onedaywear.product.repository.ProductRepository;
	import com.onedaywear.product.dto.ApiResponse;
	import com.onedaywear.product.dto.ProductRequest;
	import com.onedaywear.product.dto.ProductResponse;
	import com.onedaywear.product.service.ProductService;
	
	@Service
	public class ProductServiceImpl implements ProductService {
	
		private final ProductRepository productRepository;
	
		private final ImageStorageService imageStorageService;
		public ProductServiceImpl(ProductRepository productRepository,
	            ImageStorageService imageStorageService) {
	
	      this.productRepository = productRepository;
	      this.imageStorageService = imageStorageService;
	    }
		
	    @Override
	    public ProductResponse addProduct(ProductRequest request) {
	    	Product product = Product.builder()
	    	        .productName(request.getProductName())
	    	        .brand(request.getBrand())
	    	        .category(request.getCategory())
	    	        .productType(request.getProductType())
	    	        .size(request.getSize())
	    	        .rentalPrice(request.getRentalPrice())
	    	        .securityDeposit(request.getSecurityDeposit())
	    	        .availableQuantity(request.getAvailableQuantity())
	    	        .description(request.getDescription())
	    	        .imageUrl(request.getImageUrl())
	    	        .available(true)
	    	        .build();
	
	    	Product savedProduct = productRepository.save(product);
	
	    	return mapToResponse(savedProduct);
	    }
	
	    @Override
	    public List<ProductResponse> getAllProducts() {
	    	return productRepository.findAll()
	    	        .stream()
	    	        .map(this::mapToResponse)
	    	        .toList();
	    }
	
	    @Override
	    public ProductResponse getProductById(Long id) {
	    	Product product = productRepository.findById(id)
	    			.orElseThrow(() -> new ProductNotFoundException("Product Not Found"));
	
	    	return mapToResponse(product);
	    }
	
	    @Override
	    public ApiResponse deleteProduct(Long id) {
	    	Product product = productRepository.findById(id)
	    	        .orElseThrow(() -> new RuntimeException("Product Not Found"));
	
	    	productRepository.delete(product);
	
	    	return new ApiResponse("Product Deleted Successfully");
	    }
	    
	    private ProductResponse mapToResponse(Product product) {

	        String imageUrl = product.getImageUrl();

	        if (imageUrl != null && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
	            imageUrl = "http://localhost:8080/uploads/" + imageUrl;
	        }

	        return ProductResponse.builder()
	                .id(product.getId())
	                .productName(product.getProductName())
	                .brand(product.getBrand())
	                .category(product.getCategory())
	                .productType(product.getProductType())
	                .size(product.getSize())
	                .rentalPrice(product.getRentalPrice())
	                .securityDeposit(product.getSecurityDeposit())
	                .availableQuantity(product.getAvailableQuantity())
	                .description(product.getDescription())
	                .imageUrl(imageUrl)
	                .available(product.getAvailable())
	                .build();
	    }
	
	    @Override
	    public ProductResponse updateProduct(Long id, ProductRequest request) {
	
	        Product product = productRepository.findById(id)
	                .orElseThrow(() -> new ProductNotFoundException("Product Not Found"));
	
	        product.setProductName(request.getProductName());
	        product.setBrand(request.getBrand());
	        product.setCategory(request.getCategory());
	        product.setProductType(request.getProductType());
	        product.setSize(request.getSize());
	        product.setRentalPrice(request.getRentalPrice());
	        product.setSecurityDeposit(request.getSecurityDeposit());
	        product.setAvailableQuantity(request.getAvailableQuantity());
	        product.setDescription(request.getDescription());
	        product.setImageUrl(request.getImageUrl());
	
	        Product updatedProduct = productRepository.save(product);
	
	        return mapToResponse(updatedProduct);
	    }
	    
	    @Override
	    public List<ProductResponse> searchProducts(String name) {

	        return productRepository
	                .findByProductNameContainingIgnoreCase(name)
	                .stream()
	                .map(this::mapToResponse)
	                .toList();
	    }
	
	    @Override
	    public List<ProductResponse> getProductsByCategory(Category category) {
	
	        return productRepository.findByCategory(category)
	                .stream()
	                .map(this::mapToResponse)
	                .toList();
	    }
	    
	    @Override
	    public void decreaseStock(Long productId, Integer quantity) {
	
	        Product product = productRepository.findById(productId)
	                .orElseThrow(() -> new RuntimeException("Product Not Found"));
	
	        if (product.getAvailableQuantity() < quantity) {
	            throw new RuntimeException("Insufficient Stock");
	        }
	
	        product.setAvailableQuantity(product.getAvailableQuantity() - quantity);
	
	        if (product.getAvailableQuantity() == 0) {
	            product.setAvailable(false);
	        }
	
	        productRepository.save(product);
	    }
	
	    @Override
	    public void increaseStock(Long productId, Integer quantity) {
	
	        Product product = productRepository.findById(productId)
	                .orElseThrow(() -> new RuntimeException("Product Not Found"));
	
	        product.setAvailableQuantity(product.getAvailableQuantity() + quantity);
	
	        if (product.getAvailableQuantity() > 0) {
	            product.setAvailable(true);
	        }
	
	        productRepository.save(product);
	    }
	    
	    @Override
	    public Long getProductCount() {
	        return productRepository.count();
	    }
	    
	    @Override
	    public String uploadProductImage(Long productId,
	                                     MultipartFile file) {
	
	        Product product = productRepository.findById(productId)
	                .orElseThrow(() ->
	                        new ProductNotFoundException("Product Not Found"));
	
	        String imageName =
	                imageStorageService.saveImage(file);
	
	        product.setImageUrl(imageName);
	
	        productRepository.save(product);
	
	        return imageName;
	    }
	}
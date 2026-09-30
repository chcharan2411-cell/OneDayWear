package com.onedaywear.product.service.impl;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    String saveImage(MultipartFile file);
}
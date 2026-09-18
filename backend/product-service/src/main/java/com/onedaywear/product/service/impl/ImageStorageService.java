package com.onedaywear.product.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    
    
    public ImageStorageService() {
        System.out.println("ImageStorageService Created");
    }
    
    public String saveImage(MultipartFile file) {

        try {

            Path uploadPath = Paths.get(uploadDir);

            System.out.println("Upload Dir = " + uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName =
                    UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING);

            return fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image");
        }
    }
}
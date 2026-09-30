package com.onedaywear.product.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;
import java.net.URI;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "image.storage.type", havingValue = "s3")
public class S3ImageStorageService implements ImageStorageService {

    @Value("${aws.access.key.id}")
    private String accessKeyId;

    @Value("${aws.secret.access.key}")
    private String secretAccessKey;

    @Value("${aws.endpoint.url}")
    private String endpointUrl;

    @Value("${aws.region}")
    private String region;

    @Value("${aws.bucket.name}")
    private String bucketName;

    private S3Client s3Client;

    public S3ImageStorageService() {
        // client will be initialized lazily in saveImage
    }

    private S3Client getClient() {
        if (s3Client == null) {
            S3Client.Builder builder = S3Client.builder()
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKeyId, secretAccessKey)))
                    .region(Region.of(region));
            if (endpointUrl != null && !endpointUrl.isBlank()) {
                builder.endpointOverride(URI.create(endpointUrl));
            }
            s3Client = builder.build();
        }
        return s3Client;
    }

    @Override
    public String saveImage(MultipartFile file) {
        if (accessKeyId == null || accessKeyId.isBlank()
                || secretAccessKey == null || secretAccessKey.isBlank()
                || bucketName == null || bucketName.isBlank()
                || region == null || region.isBlank()) {
            throw new IllegalStateException("Missing required AWS S3 configuration for image storage");
        }
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();
            getClient().putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image to S3", e);
        }
    }
}

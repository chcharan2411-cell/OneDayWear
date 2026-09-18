package com.onedaywear.inventory.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onedaywear.inventory.client.ProductClient;
import com.onedaywear.inventory.dto.InventoryRequest;
import com.onedaywear.inventory.dto.InventoryResponse;
import com.onedaywear.inventory.dto.ProductResponse;
import com.onedaywear.inventory.dto.StockUpdateRequest;
import com.onedaywear.inventory.entity.Inventory;
import com.onedaywear.inventory.exception.InsufficientStockException;
import com.onedaywear.inventory.exception.InventoryNotFoundException;
import com.onedaywear.inventory.exception.ProductNotFoundException;
import com.onedaywear.inventory.repository.InventoryRepository;
import com.onedaywear.inventory.service.InventoryService;

@Service
public class InventoryServiceImpl
        implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductClient productClient;

    public InventoryServiceImpl(
            InventoryRepository inventoryRepository,
            ProductClient productClient) {

        this.inventoryRepository = inventoryRepository;
        this.productClient = productClient;
    }

    // =====================================================
    // CREATE INVENTORY
    // =====================================================

    @Override
    public InventoryResponse createInventory(
            InventoryRequest request) {

        ProductResponse product;

        try {

            product =
                    productClient.getProductById(
                            request.getProductId());

        } catch (Exception ex) {

            throw new ProductNotFoundException(
                    "Unable to find product with ID "
                            + request.getProductId());
        }

        if (product == null) {

            throw new ProductNotFoundException(
                    "Product Not Found");
        }

        /*
         * Do not create duplicate inventory.
         */
        if (inventoryRepository
                .existsByProductId(
                        request.getProductId())) {

            throw new IllegalStateException(
                    "Inventory already exists for product "
                            + request.getProductId());
        }

        Inventory inventory =
                Inventory.builder()
                        .productId(
                                request.getProductId())
                        .availableQuantity(
                                request.getQuantity())
                        .lowStockThreshold(5)
                        .build();

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        return mapToResponse(
                savedInventory,
                product);
    }

    // =====================================================
    // GET ALL EXISTING INVENTORY
    // =====================================================

    @Override
    public List<InventoryResponse> getAllInventory() {

        return inventoryRepository.findAll()
                .stream()
                .map(inventory -> {

                    ProductResponse product = null;

                    try {

                        product =
                                productClient
                                        .getProductById(
                                                inventory
                                                        .getProductId());

                    } catch (Exception ex) {

                        System.out.println(
                                "Unable to fetch product "
                                        + inventory
                                                .getProductId()
                                        + ": "
                                        + ex.getMessage());
                    }

                    return mapToResponse(
                            inventory,
                            product);
                })
                .toList();
    }

    // =====================================================
    // ADMIN INVENTORY
    // RETURNS ALL PRODUCTS
    // =====================================================

    @Override
    public List<InventoryResponse> getAdminInventory() {

        List<ProductResponse> products =
                productClient.getAllProducts();

        Map<Long, Inventory> inventoryByProduct =
                inventoryRepository.findAll()
                        .stream()
                        .collect(Collectors.toMap(
                                Inventory::getProductId,
                                inventory -> inventory,
                                (first, second) -> first
                        ));

        return products.stream()
                .map(product -> {

                    Inventory inventory =
                            inventoryByProduct.get(
                                    product.getId());

                    /*
                     * IMPORTANT:
                     *
                     * Do NOT save a fake inventory row here.
                     *
                     * If a product has no inventory record,
                     * show its Product Service quantity as the
                     * initial value.
                     *
                     * This prevents the admin page from
                     * incorrectly creating stock = 0.
                     */

                    if (inventory == null) {

                        int initialQuantity =
                                product.getAvailableQuantity() != null
                                        ? product.getAvailableQuantity()
                                        : 0;

                        inventory =
                                Inventory.builder()
                                        .productId(
                                                product.getId())
                                        .availableQuantity(
                                                initialQuantity)
                                        .lowStockThreshold(5)
                                        .build();
                    }

                    return mapToResponse(
                            inventory,
                            product);
                })
                .toList();
    }

    // =====================================================
    // ONE-TIME SYNCHRONIZATION
    // =====================================================

    @Override
    @Transactional
    public int syncInventoryFromProducts() {

        List<ProductResponse> products =
                productClient.getAllProducts();

        Map<Long, Inventory> inventoryByProduct =
                inventoryRepository.findAll()
                        .stream()
                        .collect(Collectors.toMap(
                                Inventory::getProductId,
                                inventory -> inventory,
                                (first, second) -> first
                        ));

        int initializedCount = 0;

        for (ProductResponse product : products) {

            if (product == null
                    || product.getId() == null) {

                continue;
            }

            Inventory inventory =
                    inventoryByProduct.get(
                            product.getId());

            /*
             * Only initialize missing inventory records.
             *
             * Existing Inventory Service stock is NOT
             * overwritten.
             */
            if (inventory == null) {

                int quantity =
                        product.getAvailableQuantity() != null
                                ? product.getAvailableQuantity()
                                : 0;

                inventory =
                        Inventory.builder()
                                .productId(product.getId())
                                .availableQuantity(quantity)
                                .lowStockThreshold(5)
                                .build();

                inventoryRepository.save(inventory);

                initializedCount++;
            }
        }

        return initializedCount;
    }

    // =====================================================
    // GET INVENTORY BY PRODUCT
    // =====================================================

    @Override
    public InventoryResponse getInventory(
            Long productId) {

        Inventory inventory =
                inventoryRepository
                        .findByProductId(productId)
                        .orElseThrow(() ->
                                new InventoryNotFoundException(
                                        "Inventory Not Found"));

        ProductResponse product = null;

        try {

            product =
                    productClient
                            .getProductById(productId);

        } catch (Exception ex) {

            System.out.println(
                    "Unable to fetch product "
                            + productId
                            + ": "
                            + ex.getMessage());
        }

        return mapToResponse(
                inventory,
                product);
    }

    // =====================================================
    // UPDATE INVENTORY
    // =====================================================

    @Override
    public InventoryResponse updateInventory(
            Long productId,
            InventoryRequest request) {

        /*
         * Verify that the product actually exists.
         */
        ProductResponse product;

        try {

            product =
                    productClient
                            .getProductById(productId);

        } catch (Exception ex) {

            throw new ProductNotFoundException(
                    "Unable to find product with ID "
                            + productId);
        }

        if (product == null) {

            throw new ProductNotFoundException(
                    "Product Not Found");
        }

        Inventory inventory =
                inventoryRepository
                        .findByProductId(productId)
                        .orElseGet(() ->
                                Inventory.builder()
                                        .productId(productId)
                                        .availableQuantity(0)
                                        .lowStockThreshold(5)
                                        .build());

        /*
         * Admin explicitly changes inventory stock.
         */
        inventory.setAvailableQuantity(
                request.getQuantity());

        Inventory updatedInventory =
                inventoryRepository.save(inventory);

        return mapToResponse(
                updatedInventory,
                product);
    }

    // =====================================================
    // DEDUCT STOCK
    // =====================================================

    @Override
    @Transactional
    public void deductStock(
            StockUpdateRequest request) {

        Inventory inventory =
                inventoryRepository
                        .findByProductId(
                                request.getProductId())
                        .orElseThrow(() ->
                                new InventoryNotFoundException(
                                        "Inventory Not Found"));

        int currentStock =
                inventory.getAvailableQuantity();

        if (currentStock
                < request.getQuantity()) {

            throw new InsufficientStockException(
                    "Insufficient Stock. Available: "
                            + currentStock
                            + ", Requested: "
                            + request.getQuantity());
        }

        inventory.setAvailableQuantity(
                currentStock
                        - request.getQuantity());

        inventoryRepository.save(inventory);
    }

    // =====================================================
    // RESTORE STOCK
    // =====================================================

    @Override
    @Transactional
    public void restoreStock(
            StockUpdateRequest request) {

        Inventory inventory =
                inventoryRepository
                        .findByProductId(
                                request.getProductId())
                        .orElseThrow(() ->
                                new InventoryNotFoundException(
                                        "Inventory Not Found"));

        int currentStock =
                inventory.getAvailableQuantity();

        inventory.setAvailableQuantity(
                currentStock
                        + request.getQuantity());

        inventoryRepository.save(inventory);
    }

    // =====================================================
    // LOW STOCK PRODUCTS
    // =====================================================

    @Override
    public List<InventoryResponse>
    getLowStockProducts() {

        /*
         * Do NOT use a hardcoded threshold query.
         *
         * Every inventory record can have its own
         * lowStockThreshold.
         */

        return inventoryRepository.findAll()
                .stream()
                .filter(inventory ->
                        inventory.getAvailableQuantity()
                                <= inventory
                                        .getLowStockThreshold())
                .map(inventory -> {

                    ProductResponse product = null;

                    try {

                        product =
                                productClient
                                        .getProductById(
                                                inventory
                                                        .getProductId());

                    } catch (Exception ex) {

                        System.out.println(
                                "Unable to fetch product "
                                        + inventory
                                                .getProductId()
                                        + ": "
                                        + ex.getMessage());
                    }

                    return mapToResponse(
                            inventory,
                            product);
                })
                .toList();
    }

    // =====================================================
    // LOW STOCK COUNT
    // =====================================================

    @Override
    public Long getLowStockCount() {

        return inventoryRepository.findAll()
                .stream()
                .filter(inventory ->
                        inventory.getAvailableQuantity()
                                <= inventory
                                        .getLowStockThreshold())
                .count();
    }

    // =====================================================
    // RESPONSE MAPPER
    // =====================================================

    private InventoryResponse mapToResponse(
            Inventory inventory,
            ProductResponse product) {

        String productName;

        if (product != null
                && product.getName() != null
                && !product.getName().isBlank()) {

            productName =
                    product.getName();

        } else {

            productName =
                    "Product #"
                            + inventory.getProductId();
        }

        int availableQuantity =
                inventory.getAvailableQuantity() != null
                        ? inventory.getAvailableQuantity()
                        : 0;

        int threshold =
                inventory.getLowStockThreshold() != null
                        ? inventory.getLowStockThreshold()
                        : 5;

        return InventoryResponse.builder()

                .inventoryId(
                        inventory.getId())

                .productId(
                        inventory.getProductId())

                .productName(
                        productName)

                .availableQuantity(
                        availableQuantity)

                .lowStockThreshold(
                        threshold)

                .lowStock(
                        availableQuantity
                                <= threshold)

                .lastUpdated(
                        inventory.getLastUpdated())

                .build();
    }
}
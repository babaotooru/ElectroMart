package com.electromart.service;

import com.electromart.entity.Product;
import com.electromart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    private final String UPLOAD_DIR = "uploads/products/";

    public Page<Product> getAllProducts(int page, int size) {
        return productRepository.findByStatus(Product.Status.ACTIVE, PageRequest.of(page, size));
    }

    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword);
    }

    public List<String> getCategories() {
        return productRepository.findAllCategories();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndStatus(category, Product.Status.ACTIVE);
    }

    public Product addProduct(String name, String description, BigDecimal price,
                              Integer stock, String category, String brand,
                              MultipartFile image) throws IOException {
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = saveImage(image);
        }

        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .stockQuantity(stock)
                .category(category)
                .brand(brand)
                .imageUrl(imageUrl)
                .status(Product.Status.ACTIVE)
                .build();

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, String name, String description, BigDecimal price,
                                  Integer stock, String category, String brand,
                                  MultipartFile image) throws IOException {
        Product product = getProductById(id);
        if (name != null)        product.setName(name);
        if (description != null) product.setDescription(description);
        if (price != null)       product.setPrice(price);
        if (stock != null)       product.setStockQuantity(stock);
        if (category != null)    product.setCategory(category);
        if (brand != null)       product.setBrand(brand);
        if (image != null && !image.isEmpty()) {
            product.setImageUrl(saveImage(image));
        }
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setStatus(Product.Status.INACTIVE);
        productRepository.save(product);
    }

    private String saveImage(MultipartFile file) throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + filename);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        return "/api/images/" + filename;
    }
}

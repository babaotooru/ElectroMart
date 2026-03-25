package com.electromart.repository;

import com.electromart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);

    Page<Product> findByStatus(Product.Status status, Pageable pageable);

    List<Product> findByCategoryAndStatus(String category, Product.Status status);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(String keyword);

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.status = 'ACTIVE'")
    List<String> findAllCategories();

    @Query("SELECT p FROM Product p WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(:name)) " +
            "AND LOWER(TRIM(p.category)) = LOWER(TRIM(:category)) " +
            "AND LOWER(TRIM(COALESCE(p.brand, ''))) = LOWER(TRIM(COALESCE(:brand, '')))")
    Optional<Product> findDuplicateProduct(String name, String category, String brand);

    long countByStatus(Product.Status status);
}

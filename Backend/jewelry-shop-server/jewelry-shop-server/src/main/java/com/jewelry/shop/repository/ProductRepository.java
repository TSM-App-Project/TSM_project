package com.jewelry.shop.repository;

import com.jewelry.shop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Bổ sung: Hỗ trợ tìm kiếm sản phẩm gần đúng theo tên (không phân biệt hoa thường)
    List<Product> findByProductNameContainingIgnoreCase(String productName);

    boolean existsByProductName(String productName);

    // Bổ sung: Custom query để lấy các sản phẩm sắp hết hàng (hỗ trợ làm Dashboard)
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= :threshold AND p.status = 'ACTIVE'")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);
}
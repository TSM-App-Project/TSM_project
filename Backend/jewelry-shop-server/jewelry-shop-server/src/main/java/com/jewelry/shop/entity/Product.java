package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(nullable = false, unique = true)
    private String productName;

    // Khớp với numeric(18, 3) dưới DB
    @Column(nullable = false, precision = 18, scale = 3)
    private BigDecimal weight;

    // Khớp với numeric(18, 2) dưới DB
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal laborCost;

    // Khớp với numeric(18, 2) dưới DB
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal purchasePrice;

    @Column(columnDefinition = "integer default 0")
    private Integer stockQuantity = 0;

    // Khớp với varchar(20) dưới DB
    @Column(length = 20)
    private String status = "ACTIVE";
}
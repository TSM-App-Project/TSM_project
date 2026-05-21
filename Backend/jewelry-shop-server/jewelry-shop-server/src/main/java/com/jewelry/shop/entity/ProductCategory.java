package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Generated;

import java.math.BigDecimal;

@Entity
@Table(name = "product_categories")
@Data
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    @Column(nullable = false, unique = true)
    private String categoryName;

    @Column(name = "unit_name", nullable = false, length = 50)
    private String unitName;

    @Column(precision = 5, scale = 2)
    private BigDecimal profitPercentage = BigDecimal.ZERO;
}

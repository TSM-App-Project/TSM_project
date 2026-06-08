package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "product_categories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    @Column(name = "category_name", nullable = false, unique = true)
    private String categoryName;

    @Column(name = "unit_name", nullable = false, length = 50)
    private String unitName;

    @Builder.Default
    @Column(name = "profit_percentage", precision = 5, scale = 2)
    private BigDecimal profitPercentage = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "status", length = 20)
    private String status = "ACTIVE";
}
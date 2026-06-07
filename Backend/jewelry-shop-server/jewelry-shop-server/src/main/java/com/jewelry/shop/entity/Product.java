package com.jewelry.shop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "products")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(name = "product_name", nullable = false, unique = true)
    private String productName;

    @Column(nullable = false, precision = 18, scale = 3)
    private BigDecimal weight;

    @Column(name = "labor_cost", nullable = false, precision = 18, scale = 2)
    private BigDecimal laborCost;

    @Column(name = "purchase_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal purchasePrice;

    @Builder.Default
    @Min(0)
    @Column(name = "stock_quantity", columnDefinition = "integer default 0")
    private Integer stockQuantity = 0;

    @Builder.Default
    @Column(length = 20)
    private String status = "ACTIVE";

    @Version
    private Integer version;
}
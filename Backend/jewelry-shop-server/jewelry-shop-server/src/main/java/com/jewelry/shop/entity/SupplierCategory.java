package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "supplier_categories")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class SupplierCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    @Column(name = "category_name", nullable = false, unique = true, length = 100)
    private String categoryName;

    @Column(columnDefinition = "text")
    private String description;

    @Builder.Default
    @Column(length = 20)
    private String status = "ACTIVE";
}
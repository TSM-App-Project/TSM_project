package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "suppliers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer supplierId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private SupplierCategory category;

    @Column(name = "supplier_name", nullable = false, unique = true, length = 255)
    private String supplierName;

    @Column(length = 15)
    private String phone;

    @Column(name = "tax_code", unique = true, length = 50)
    private String taxCode;

    @Column(columnDefinition = "text")
    private String address;

    @Builder.Default
    @Column(name = "total_debt", precision = 18, scale = 2)
    private BigDecimal totalDebt = BigDecimal.ZERO;

    @Builder.Default
    @Column(length = 20)
    private String status = "ACTIVE";

    @Version
    private Integer version;
}
package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "suppliers")
@Data
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer supplierId;

    @Column(name = "supplier_name", nullable = false, unique = true, length = 255)
    private String supplierName;

    @Column(length = 15)
    private String phone;

    @Column(columnDefinition = "text")
    private String address;

    @Column(name = "tax_code", unique = true, length = 50)
    private String taxCode;

    @Column(name = "total_debt", precision = 18, scale = 2)
    private BigDecimal totalDebt = BigDecimal.ZERO;

    @Column(length = 20)
    private String status = "ACTIVE";
}
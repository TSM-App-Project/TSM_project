package com.jewelry.shop.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Formula;
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

    @Formula("(SELECT COALESCE((SELECT SUM(pr.total_amount) FROM purchase_receipts pr WHERE pr.supplier_id = supplier_id), 0) - COALESCE((SELECT SUM(dp.amount) FROM debt_payments dp WHERE dp.supplier_id = supplier_id), 0))")
    private BigDecimal totalDebt;

    @Builder.Default
    @Column(length = 20)
    private String status = "ACTIVE";

    @Version
    private Integer version;
}
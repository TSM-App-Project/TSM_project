package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "inventory_report_details")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class InventoryReportDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detailId;

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    private InventoryReport inventoryReport;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Builder.Default
    @Column(name = "opening_stock")
    private Integer openingStock = 0;

    @Builder.Default
    @Column(name = "in_quantity")
    private Integer inQuantity = 0;

    @Builder.Default
    @Column(name = "out_quantity")
    private Integer outQuantity = 0;

    @Builder.Default
    @Column(name = "closing_stock")
    private Integer closingStock = 0;
}
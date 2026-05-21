package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "inventory_report_details")
@Data
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

    @Column(name = "opening_stock")
    private Integer openingStock = 0;

    @Column(name = "in_quantity")
    private Integer inQuantity = 0;

    @Column(name = "out_quantity")
    private Integer outQuantity = 0;

    @Column(name = "closing_stock")
    private Integer closingStock = 0;
}
package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "revenue_report_details")
@Data
public class RevenueReportDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detailId;

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    private RevenueReport revenueReport;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(name = "revenue_amount", precision = 18, scale = 2)
    private BigDecimal revenueAmount = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentage = BigDecimal.ZERO;
}
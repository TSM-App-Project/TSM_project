package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "revenue_report_details")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
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

    @Builder.Default
    @Column(name = "revenue_amount", precision = 18, scale = 2)
    private BigDecimal revenueAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(precision = 5, scale = 2)
    private BigDecimal percentage = BigDecimal.ZERO;
}
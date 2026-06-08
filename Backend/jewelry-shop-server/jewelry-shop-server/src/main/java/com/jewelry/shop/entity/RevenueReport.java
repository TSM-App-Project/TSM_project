package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "revenue_reports", uniqueConstraints = {@UniqueConstraint(columnNames = {"report_month", "report_year"})})
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class RevenueReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reportId;

    @Column(name = "report_month", nullable = false)
    private Integer reportMonth;

    @Column(name = "report_year", nullable = false)
    private Integer reportYear;

    @Builder.Default
    @Column(name = "total_revenue", precision = 18, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
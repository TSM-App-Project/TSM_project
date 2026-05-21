package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_reports", uniqueConstraints = {@UniqueConstraint(columnNames = {"report_month", "report_year"})})
@Data
public class InventoryReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reportId;

    @Column(name = "report_month", nullable = false)
    private Integer reportMonth;

    @Column(name = "report_year", nullable = false)
    private Integer reportYear;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
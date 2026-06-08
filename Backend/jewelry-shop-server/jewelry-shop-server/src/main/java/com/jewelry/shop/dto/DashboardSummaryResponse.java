package com.jewelry.shop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DashboardSummaryResponse {
    private long totalProducts;
    private long totalCustomers;
    private long totalSuppliers;
    private long totalServices;
    private long totalOrders;
    private BigDecimal totalSales;
    private BigDecimal totalPurchases;
}

package com.jewelry.shop.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueReportDto {
    private String monthYear;
    private BigDecimal salesRevenue;
    private BigDecimal serviceRevenue;
    private BigDecimal purchaseCost;
    private BigDecimal totalRevenue;
    private BigDecimal totalProfit;
    private String growthRate;
}

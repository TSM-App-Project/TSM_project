package com.jewelry.shop.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategorySalesDto {
    private String categoryName;
    private BigDecimal totalSales;
}

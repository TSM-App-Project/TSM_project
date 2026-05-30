package com.jewelry.shop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductCategoryRequest {
    private String categoryName;
    private String unitName;
    private BigDecimal profitPercentage;
}

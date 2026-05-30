package com.jewelry.shop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    private Integer categoryId;
    private String productName;
    private BigDecimal weight;
    private BigDecimal laborCost;
    private BigDecimal purchasePrice;
    private Integer stockQuantity;
    private String status;
}

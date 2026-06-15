package com.jewelry.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Integer productId;
    
    // Flattened category details
    private Integer categoryId;
    private String categoryName;
    
    // Flattened supplier details
    private Integer supplierId;
    private String supplierName;
    
    private String productName;
    private BigDecimal weight;
    private BigDecimal laborCost;
    private BigDecimal purchasePrice;
    private Integer stockQuantity;
    private String status;
}

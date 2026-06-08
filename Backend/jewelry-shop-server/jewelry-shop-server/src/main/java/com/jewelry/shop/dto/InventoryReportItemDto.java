package com.jewelry.shop.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryReportItemDto {
    private Integer productId;
    private String productName;
    private String unit;
    private int openingStock;
    private int purchasedQuantity;
    private int soldQuantity;
    private int closingStock;
}

package com.jewelry.shop.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InventoryReportDetailRequest {
    private Integer reportId;
    private Integer reportMonth;
    private Integer reportYear;
    private LocalDateTime createdAt;
    private Integer productId;
    private Integer openingStock;
    private Integer inQuantity;
    private Integer outQuantity;
    private Integer closingStock;
}

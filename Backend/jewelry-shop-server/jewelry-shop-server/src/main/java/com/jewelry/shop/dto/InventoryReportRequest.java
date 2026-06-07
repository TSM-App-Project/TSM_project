package com.jewelry.shop.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InventoryReportRequest {
    private Integer reportMonth;
    private Integer reportYear;
    private LocalDateTime createdAt;
    private List<InventoryReportDetailRequest> details;

    @Data
    public static class InventoryReportDetailRequest {
        private Integer productId;
        private Integer openingStock;
        private Integer inQuantity;
        private Integer outQuantity;
        private Integer closingStock;
    }
}

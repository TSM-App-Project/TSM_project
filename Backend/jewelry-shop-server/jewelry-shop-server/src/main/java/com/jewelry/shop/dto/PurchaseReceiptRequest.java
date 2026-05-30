package com.jewelry.shop.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PurchaseReceiptRequest {
    private Integer supplierId;
    private Integer userId;
    private LocalDateTime purchaseDate;
    private List<PurchaseItemRequest> items;

    @Data
    public static class PurchaseItemRequest {
        private Integer productId;
        private Integer quantity;
        private BigDecimal purchasePrice;
    }
}

package com.jewelry.shop.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceRequest {
    private Integer customerId;
    private Integer userId;
    private LocalDateTime createdAt;
    private List<InvoiceItemRequest> items;

    @Data
    public static class InvoiceItemRequest {
        private Integer productId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}

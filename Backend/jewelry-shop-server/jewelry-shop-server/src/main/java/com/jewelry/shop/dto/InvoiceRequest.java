package com.jewelry.shop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceRequest {
    // Có thể null nếu là khách vãng lai
    private Integer customerId;

    @NotNull(message = "Người lập đơn không được để trống")
    private Integer userId;

    private LocalDateTime createdAt;

    @NotEmpty(message = "Danh sách sản phẩm không được trống")
    @Valid // Kích hoạt bắt lỗi cho các phần tử bên trong List
    private List<InvoiceItemRequest> items;

    @Data
    public static class InvoiceItemRequest {
        @NotNull(message = "Thiếu ID sản phẩm")
        private Integer productId;

        @NotNull(message = "Thiếu số lượng")
        @Min(value = 1, message = "Số lượng phải lớn hơn 0")
        private Integer quantity;

        private BigDecimal unitPrice;
    }
}



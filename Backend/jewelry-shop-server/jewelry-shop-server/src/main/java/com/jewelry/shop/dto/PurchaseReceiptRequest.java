package com.jewelry.shop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PurchaseReceiptRequest {
    @NotNull(message = "Nhà cung cấp không được trống")
    private Integer supplierId;

    @NotNull(message = "Người nhập kho không được trống")
    private Integer userId;

    // ✅ BỔ SUNG: PurchaseReceiptService gọi request.getPurchaseDate(), field này bị thiếu
    private LocalDateTime purchaseDate;

    @NotEmpty(message = "Danh sách sản phẩm nhập không được trống")
    @Valid
    private List<PurchaseItemRequest> items;

    @Data
    public static class PurchaseItemRequest {
        @NotNull(message = "Thiếu ID sản phẩm")
        private Integer productId;

        @NotNull(message = "Thiếu số lượng")
        @Min(value = 1, message = "Số lượng nhập phải lớn hơn 0")
        private Integer quantity;

        @NotNull(message = "Thiếu giá nhập")
        @DecimalMin(value = "0.0", message = "Giá nhập không được âm")
        private BigDecimal purchasePrice;
    }
}

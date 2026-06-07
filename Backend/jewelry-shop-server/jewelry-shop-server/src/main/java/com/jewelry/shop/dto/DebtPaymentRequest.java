package com.jewelry.shop.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class DebtPaymentRequest {
    @NotNull(message = "Phải chọn nhà cung cấp")
    private Integer supplierId;

    @NotNull(message = "Người lập phiếu không được trống")
    private Integer userId;

    @NotNull(message = "Số tiền không được trống")
    @DecimalMin(value = "0.01", message = "Số tiền phải lớn hơn 0")
    private BigDecimal amount;

    @NotBlank(message = "Loại chứng từ (Thu/Chi) không được trống")
    private String documentType;

    private String paymentStatus;
}
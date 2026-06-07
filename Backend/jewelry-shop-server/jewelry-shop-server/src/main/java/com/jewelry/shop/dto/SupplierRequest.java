package com.jewelry.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class SupplierRequest {
    @NotNull(message = "Danh mục nhà cung cấp không được trống")
    private Integer categoryId;

    @NotBlank(message = "Tên nhà cung cấp không được trống")
    private String supplierName;

    private String phone;
    private String address;
    private String taxCode;
    private BigDecimal totalDebt;
    private String status;
}
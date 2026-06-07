package com.jewelry.shop.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotNull(message = "Danh mục sản phẩm không được trống")
    private Integer categoryId;

    @NotBlank(message = "Tên sản phẩm không được trống")
    private String productName;

    @NotNull(message = "Trọng lượng không được trống")
    @DecimalMin(value = "0.0", message = "Trọng lượng phải lớn hơn hoặc bằng 0")
    private BigDecimal weight;

    @NotNull(message = "Tiền công không được trống")
    @DecimalMin(value = "0.0", message = "Tiền công không hợp lệ")
    private BigDecimal laborCost;

    @NotNull(message = "Giá mua vào không được trống")
    @DecimalMin(value = "0.0", message = "Giá mua không hợp lệ")
    private BigDecimal purchasePrice;

    private Integer stockQuantity;
    private String status;
}
package com.jewelry.shop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductCategoryRequest {
    @NotBlank(message = "Tên loại sản phẩm không được trống")
    private String categoryName;

    @NotBlank(message = "Đơn vị tính không được trống")
    private String unitName;

    private BigDecimal profitPercentage;
}
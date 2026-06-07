package com.jewelry.shop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupplierCategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    private String categoryName;
    private String description;
    private String status;
}
package com.jewelry.shop.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceRequest {

    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String serviceName;

    @NotNull(message = "Giá dịch vụ không được để trống")
    @DecimalMin(value = "0.0", message = "Giá dịch vụ không được nhỏ hơn 0")
    private BigDecimal basePrice;

    private String unitName;

    private String status;
}
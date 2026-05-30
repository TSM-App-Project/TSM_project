package com.jewelry.shop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceRequest {
    private String serviceName;
    private BigDecimal basePrice;
    private String status;
}

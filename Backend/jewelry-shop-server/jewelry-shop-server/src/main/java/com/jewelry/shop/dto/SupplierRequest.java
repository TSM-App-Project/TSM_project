package com.jewelry.shop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SupplierRequest {
    private String supplierName;
    private String phone;
    private String address;
    private String taxCode;
    private BigDecimal totalDebt;
    private String status;
}

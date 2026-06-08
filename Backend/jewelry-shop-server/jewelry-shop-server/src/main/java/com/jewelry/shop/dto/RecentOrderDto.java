package com.jewelry.shop.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecentOrderDto {
    private Integer invoiceId;
    private String customerName;
    private String firstProductName; // Derived from details
    private String status;
    private BigDecimal totalAmount;
    private String date;
}

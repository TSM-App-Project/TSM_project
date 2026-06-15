package com.jewelry.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyRevenueDto {
    private String date;
    private BigDecimal revenue;
    private BigDecimal purchases;
}

package com.jewelry.shop.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ServiceTicketRequest {
    private Integer customerId;
    private Integer userId;
    private LocalDateTime createdAt;
    private List<ServiceTicketDetailRequest> details;

    @Data
    public static class ServiceTicketDetailRequest {
        private Integer serviceId;
        private BigDecimal servicePrice;
        private BigDecimal extraCost;
        private Integer quantity;
        private BigDecimal prepaidAmount;
        private LocalDate deliveryDate;
        private String status;
    }
}

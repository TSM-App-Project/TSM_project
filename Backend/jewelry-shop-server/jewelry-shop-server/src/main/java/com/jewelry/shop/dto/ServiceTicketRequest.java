package com.jewelry.shop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ServiceTicketRequest {
    @NotNull(message = "Khách hàng không được để trống")
    private Integer customerId;

    @NotNull(message = "Nhân viên tiếp nhận không được để trống")
    private Integer userId;

    private LocalDateTime createdAt;

    @NotEmpty(message = "Phải có ít nhất một dịch vụ gia công")
    @Valid
    private List<ServiceTicketItemRequest> items; // ✅ SỬA: đổi "details" → "items" cho nhất quán

    @Data
    public static class ServiceTicketItemRequest {
        @NotNull(message = "Thiếu ID dịch vụ")
        private Integer serviceId;

        @NotNull(message = "Thiếu số lượng")
        @Min(value = 1, message = "Số lượng phải lớn hơn 0")
        private Integer quantity;

        // ✅ BỔ SUNG: servicePrice (override giá cơ bản, nullable = dùng basePrice)
        @DecimalMin(value = "0.0", message = "Giá dịch vụ không hợp lệ")
        private BigDecimal servicePrice;

        @DecimalMin(value = "0.0", message = "Chi phí phát sinh không hợp lệ")
        private BigDecimal extraCost;

        @NotNull(message = "Số tiền trả trước không được để trống")
        @DecimalMin(value = "0.0", message = "Số tiền trả trước không được âm")
        private BigDecimal prepaidAmount;

        @NotNull(message = "Ngày hẹn giao không được trống")
        private LocalDate deliveryDate;

        // ✅ BỔ SUNG: status field (dùng trong ServiceTicketService)
        private String status;
    }
}

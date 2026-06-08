package com.jewelry.shop.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Formula;
import java.math.BigDecimal;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "customers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer customerId;

    @Column(name = "phone_number", nullable = false, unique = true, length = 15)
    private String phoneNumber;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    private LocalDate dob;

    @Builder.Default
    @Column(name = "total_points")
    private Integer totalPoints = 0;

    @Formula("(SELECT COALESCE((SELECT COUNT(i.invoice_id) FROM invoices i WHERE i.customer_id = customer_id), 0) + COALESCE((SELECT COUNT(st.ticket_id) FROM service_tickets st WHERE st.customer_id = customer_id), 0))")
    private Integer totalOrders;

    @Formula("(SELECT COALESCE((SELECT SUM(i.total_amount) FROM invoices i WHERE i.customer_id = customer_id), 0) + COALESCE((SELECT SUM(st.grand_total) FROM service_tickets st WHERE st.customer_id = customer_id), 0))")
    private BigDecimal totalAmountSpent;

    @Transient
    private String memberTier;

    public String getMemberTier() {
        if (totalAmountSpent == null) return "Thành viên";
        if (totalAmountSpent.compareTo(new BigDecimal("30000000")) > 0) return "Platinum";
        if (totalAmountSpent.compareTo(new BigDecimal("20000000")) > 0) return "Gold";
        if (totalAmountSpent.compareTo(new BigDecimal("10000000")) > 0) return "Silver";
        return "Thành viên";
    }

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Version
    private Integer version;
}
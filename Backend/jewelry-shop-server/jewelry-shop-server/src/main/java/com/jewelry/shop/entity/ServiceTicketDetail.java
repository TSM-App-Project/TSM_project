package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "service_ticket_details")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceTicketDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private ServiceTicket serviceTicket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(name = "service_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal servicePrice;

    @Builder.Default
    @Column(name = "extra_cost", precision = 18, scale = 2)
    private BigDecimal extraCost = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "calculated_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal calculatedPrice;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "prepaid_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal prepaidAmount;

    @Column(name = "remaining_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal remainingAmount;

    @Column(name = "delivery_date", nullable = false)
    private LocalDate deliveryDate;

    @Builder.Default
    @Column(length = 50)
    private String status = "CHƯA GIAO";
}
package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer customerId;

    @Column(name = "phone_number", nullable = false, unique = true, length = 15)
    private String phoneNumber;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    private LocalDate dob;

    @Column(name = "total_points")
    private Integer totalPoints = 0;

    @Column(name = "member_tier", length = 50)
    private String memberTier = "Thành viên";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
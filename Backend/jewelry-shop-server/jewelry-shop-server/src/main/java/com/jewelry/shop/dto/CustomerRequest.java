package com.jewelry.shop.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CustomerRequest {
    private String phoneNumber;
    private String fullName;
    private LocalDate dob;
    private Integer totalPoints;
    private String memberTier;
}

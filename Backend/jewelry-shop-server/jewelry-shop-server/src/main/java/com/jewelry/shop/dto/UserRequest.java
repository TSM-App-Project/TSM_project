package com.jewelry.shop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String username;

    private String password;

    @NotBlank(message = "Tên không được để trống")
    private String fullName;

    private String role;
    private String status;
}

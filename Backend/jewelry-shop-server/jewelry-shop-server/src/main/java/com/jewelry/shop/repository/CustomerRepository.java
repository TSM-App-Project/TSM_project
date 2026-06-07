package com.jewelry.shop.repository;

import com.jewelry.shop.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    // Bổ sung: Tìm khách hàng qua SĐT (rất hay dùng ở màn hình POS)
    Optional<Customer> findByPhoneNumber(String phoneNumber);

    // Bổ sung: Kiểm tra SĐT đã đăng ký chưa
    boolean existsByPhoneNumber(String phoneNumber);
}